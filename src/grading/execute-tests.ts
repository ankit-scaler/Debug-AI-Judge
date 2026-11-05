import * as esbuild from 'esbuild';
// jsdom is pinned to an EXACT version (package.json), not a range: 28.0.0+
// depends on html-encoding-sniffer@^6, and 30.x (where this was until this
// pin) pulls html-encoding-sniffer@^7 -> @exodus/bytes, which is pure ESM.
// html-encoding-sniffer@7's own require() of it only works via Node's
// require(esm) interop, which it gates behind engines: "^22.13.0 || >=24.0.0"
// -- confirmed live: Vercel's deployed function runtime doesn't satisfy that,
// so just `import { JSDOM } from 'jsdom'` crashed at module-evaluation time
// with ERR_REQUIRE_ESM, before this file's own code (or the route's
// try/catch around executeTests()) ever ran. 27.0.0 is the newest version
// still on html-encoding-sniffer@^4 (whatwg-encoding only, no @exodus/bytes,
// engines >=20) and has a byte-identical getInternalVMContext()/runScripts
// implementation to 30.1.3 -- confirmed by diffing lib/api.js directly.
// Bumping this past 27.x needs the same check repeated first.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import {
  loaderFor,
  resolveRelative,
  stripNamespace,
  stripNamespaceEverywhere,
  VIRTUAL_NAMESPACE,
} from '../bundling/resolve';
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from '../preview/devtools-source';
import { INTERCEPTOR_MODULE } from '../preview/interceptor-source';
import type { TestResult } from '../testing/browser-test-harness';
import type { SubmittedFile } from '../types';
import type { BuildError } from './build-gate';

const HARNESS_PATH = join(process.cwd(), 'src/testing/browser-test-harness.ts');
const HARNESS_VIRTUAL = '__debuglab_harness__.ts';
const SETUP_VIRTUAL = '__debuglab_setup__.js';
const INTERCEPTOR_VIRTUAL = '__debuglab_interceptor__.js';
const ENTRY_VIRTUAL = '__debuglab_test_entry__.js';

// A ported test that renders real components (e.g. porting a client-side
// *.test.jsx that uses react-dom/client + act) needs a real React, not an
// external reference nothing in node:vm can resolve. Unlike the browser
// bundle, there is no import map here to point an external 'react' at --
// bundling it for real, straight from this project's own node_modules
// (react/react-dom are already real dependencies), is simpler and correct.
const BUNDLE_FROM_NODE_MODULES = new Set([
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
]);

export type ExecuteTestsResult =
  | { status: 'ran'; tests: TestResult[] }
  | { status: 'build_failed'; errors: BuildError[] }
  | { status: 'timed_out' };

/**
 * Bundles a question's files plus a ported test file into one self-contained
 * script (reusing the same virtual-filesystem esbuild plugin as build-gate.ts)
 * and executes it in a `node:vm` context -- real assertions, really run,
 * against the learner's actual submitted code. Never trusts a browser-run
 * result: this is what Submit calls for a `gradingMode: 'tests'` question.
 *
 * `node:vm`'s own `timeout` option only bounds *synchronous* execution (an
 * infinite `while(true)`); it does not interrupt code that awaits a promise
 * or timer and never resolves it. The real wall-clock bound here is the
 * Promise.race below -- the vm `timeout` is kept too, as a second, cheaper
 * line of defence for the synchronous case. This is not a hard security
 * boundary (bare `vm` contexts are not escape-proof against someone
 * deliberately trying), only a bound on accidental bad code -- adequate for
 * grading a debugging exercise, not for arbitrary untrusted execution.
 */
export async function executeTests(
  files: SubmittedFile[],
  testEntry: string,
  handlersPath?: string,
  // A suite that renders real components (jsdom + act()) or deliberately
  // overlaps several hundred-millisecond artificial delays to force a race
  // genuinely needs more than a couple of seconds; 5s cut a real, correct
  // suite off mid-run the first time this was tried against a live Submit.
  timeoutMs = 15000,
): Promise<ExecuteTestsResult> {
  const map = new Map(files.map((f) => [f.path, f.content]));
  map.set(HARNESS_VIRTUAL, readFileSync(HARNESS_PATH, 'utf8'));
  map.set(
    SETUP_VIRTUAL,
    `import { createTestHarness } from './${HARNESS_VIRTUAL}';\nglobalThis.__debuglab_harness__ = createTestHarness();\n`,
  );
  // Same interceptor the browser preview uses (src/preview/bundler.ts),
  // wired to this question's mock handlers, so a ported test's fetch() calls
  // hit the exact same simulated backend the learner's own app talks to --
  // one source of truth, not a second mock just for grading.
  if (handlersPath) {
    map.set(INTERCEPTOR_VIRTUAL, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${handlersPath}`));
    // Question files import '../__devtools__.js' (serverLog). The SAME module
    // the preview bundles, not a stripped fork: its terminal-run listener is
    // simply never triggered during Submit. Not imported from the entry --
    // it only needs to be resolvable.
    map.set(DEVTOOLS_VIRTUAL, devtoolsModuleFor(handlersPath));
  }
  map.set(
    ENTRY_VIRTUAL,
    (handlersPath ? `import './${INTERCEPTOR_VIRTUAL}';\n` : '') +
      `import './${SETUP_VIRTUAL}';\nimport './${testEntry}';\n\n` +
      `(async () => {\n` +
      `  try {\n` +
      `    const results = await globalThis.__debuglab_harness__.run();\n` +
      `    globalThis.__debuglab_report__(results);\n` +
      `  } catch (err) {\n` +
      `    globalThis.__debuglab_report__([\n` +
      `      { name: 'test file failed to load', passed: false, error: err instanceof Error ? err.message : String(err) },\n` +
      `    ]);\n` +
      `  }\n` +
      `})();\n`,
  );

  if (!map.has(testEntry)) {
    return {
      status: 'build_failed',
      errors: [{ file: testEntry, line: 0, column: 0, text: `Test entry "${testEntry}" is missing` }],
    };
  }

  const virtual: esbuild.Plugin = {
    name: 'debuglab-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'entry-point') return { path: args.path, namespace: VIRTUAL_NAMESPACE };
        // Only our own virtual files get our custom resolution. A relative
        // import *inside* a real node_modules package (e.g. react's own
        // ./cjs/react.development.js) must fall through to esbuild's default
        // resolver, which knows about real files on disk -- our `map` does not.
        if (args.namespace !== VIRTUAL_NAMESPACE) return undefined;
        if (!args.path.startsWith('.')) {
          if (BUNDLE_FROM_NODE_MODULES.has(args.path)) return undefined; // let esbuild resolve it from real node_modules
          return { path: args.path, external: true };
        }
        const resolved = resolveRelative(args.importer, args.path, map);
        if (!resolved) {
          return { errors: [{ text: `Cannot resolve "${args.path}" from "${args.importer}"` }] };
        }
        return { path: resolved, namespace: VIRTUAL_NAMESPACE };
      });
      build.onLoad({ filter: /.*/, namespace: VIRTUAL_NAMESPACE }, (args) => ({
        contents: map.get(args.path) ?? '',
        loader: loaderFor(args.path),
        // Virtual files have no real location of their own; without this,
        // esbuild's default resolver (used for the whitelisted bare React
        // imports above) has no directory to search node_modules from.
        resolveDir: process.cwd(),
      }));
    },
  };

  let bundled: string;
  try {
    const result = await esbuild.build({
      entryPoints: [ENTRY_VIRTUAL],
      bundle: true,
      write: false,
      outdir: 'out',
      logLevel: 'silent',
      format: 'iife',
      jsx: 'automatic',
      plugins: [virtual],
    });
    bundled = result.outputFiles.find((f) => f.path.endsWith('.js'))!.text;
  } catch (err) {
    const messages = (err as esbuild.BuildFailure).errors ?? [];
    return {
      status: 'build_failed',
      errors: messages.map((m) => ({
        file: stripNamespace(m.location?.file) ?? testEntry,
        line: m.location?.line ?? 0,
        column: m.location?.column ?? 0,
        text: stripNamespaceEverywhere(m.text),
      })),
    };
  }

  // A real DOM, not a hand-rolled stand-in: a ported test that renders real
  // components (react-dom/client + document.createElement) needs one, and
  // it is simplest to use it as the vm's global object for every run, not
  // just the ones that happen to need it. jsdom provides `document`,
  // `window`, `navigator`, `localStorage` (real, given a url) and its own
  // `location`/`URL` all consistently tied to one another.
  //
  // `runScripts: 'outside-only'` + getInternalVMContext() is jsdom's own
  // documented way to get a context usable with node:vm -- using dom.window
  // directly with vm.createContext() looks like it works (no error) but
  // properties assigned afterward are not actually visible as `globalThis.X`
  // to code later run in that context, which surfaced as a very confusing
  // "callback is not a function" failure before this fix.
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    runScripts: 'outside-only',
  });
  const sandbox = dom.getInternalVMContext() as unknown as Record<string, unknown>;

  return new Promise((resolve) => {
    let settled = false;
    const settle = (result: ExecuteTestsResult) => {
      if (settled) return;
      settled = true;
      sandbox.__debuglab_report__ = () => {};
      // Releases jsdom's own internal timers/resources. Safe to do here now
      // that `sandbox` (getInternalVMContext()) is a distinct object from
      // `dom.window` -- unlike the earlier (reverted) attempt at closing the
      // window itself, this cannot un-define anything script execution reads.
      dom.window.close();
      resolve(result);
    };

    sandbox.console = console;
    // jsdom's own window.setTimeout, under runScripts: 'outside-only', does
    // not reliably keep *this* (host) process's event loop alive the way a
    // real Node timer does -- a ported test awaiting one of its own delays
    // could have the whole process exit from under it with nothing ever
    // resolving. Node's real timers behave correctly here.
    sandbox.setTimeout = setTimeout;
    sandbox.clearTimeout = clearTimeout;
    sandbox.setInterval = setInterval;
    sandbox.clearInterval = clearInterval;
    // The interceptor (src/preview/interceptor-source.ts) constructs its
    // mocked responses with `new Response`; jsdom does not implement fetch.
    sandbox.Response = Response;
    sandbox.Request = Request;
    sandbox.Headers = Headers;
    // React's act() (used by ported client-side tests that render real
    // components) schedules work through a real MessageChannel; jsdom does
    // not implement one. Each one's two real MessagePorts are never
    // explicitly closed by React, and unlike jsdom's own resources they are
    // not released by dom.window.close() -- left alone, every test run leaks
    // a pair of them that keeps the process alive indefinitely. unref() on
    // creation fixes that without changing how message passing behaves.
    sandbox.MessageChannel = class extends MessageChannel {
      constructor() {
        super();
        // `unref` is a Node extension to MessagePort, not in the DOM lib
        // types. Node re-refs a port the moment a 'message' listener is
        // attached to it (documented Node behavior, which React's scheduler
        // triggers internally) -- so a test that renders real components can
        // still leave a couple of ref'd ports behind in a long-running
        // process. Overriding ref() itself to stop that was tried and
        // reverted: it silently breaks the scheduler's own message delivery
        // (a deeper worker_threads interaction, not pursued further) --
        // documented as a known, bounded limitation rather than fixed blind.
        for (const port of [this.port1, this.port2]) {
          (port as unknown as { unref(): void }).unref();
        }
      }
    };
    sandbox.__debuglab_report__ = (tests: TestResult[]) => settle({ status: 'ran', tests });

    const timer = setTimeout(() => settle({ status: 'timed_out' }), timeoutMs);
    timer.unref?.();

    try {
      const script = new vm.Script(bundled, { filename: 'debuglab-test-bundle.js' });
      script.runInContext(sandbox, { timeout: timeoutMs });
    } catch (err) {
      settle({
        status: 'ran',
        tests: [
          {
            name: 'test bundle crashed synchronously',
            passed: false,
            error: err instanceof Error ? err.message : String(err),
          },
        ],
      });
    }
  });
}
