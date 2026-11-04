import * as esbuild from 'esbuild-wasm';
import {
  loaderFor,
  resolveRelative,
  stripNamespace,
  stripNamespaceEverywhere,
  VIRTUAL_NAMESPACE,
} from '../bundling/resolve';
import { ensureInitialised, type PreviewBuildError, type PreviewFile } from './bundler';
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from './devtools-source';
import { INTERCEPTOR_MODULE } from './interceptor-source';

// Same virtual names as src/grading/execute-tests.ts. HARNESS_VIRTUAL must
// end in .ts: the harness source is real TypeScript (`export interface`,
// type annotations), and loaderFor() picks the loader from the extension --
// a .js name gets the jsx loader and fails with `Unexpected "interface"`.
const HARNESS_VIRTUAL = '__debuglab_harness__.ts';
const SETUP_VIRTUAL = '__debuglab_setup__.js';
const INTERCEPTOR_VIRTUAL = '__debuglab_interceptor__.js';
const ENTRY_VIRTUAL = '__debuglab_test_entry__.js';

const REACT_EXTERNALS = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'];

let harnessSourcePromise: Promise<string> | null = null;
function fetchHarnessSource(): Promise<string> {
  // Fetched once per page load, not once per `npm test`. A failed fetch is
  // not cached, so the next `npm test` retries instead of replaying it.
  harnessSourcePromise ??= fetch('/preview/vendor/harness-source.txt')
    .then((r) => {
      if (!r.ok) throw new Error(`could not load the test harness (HTTP ${r.status})`);
      return r.text();
    })
    .catch((err) => {
      harnessSourcePromise = null;
      throw err;
    });
  return harnessSourcePromise;
}

export interface BundleTestsOptions {
  files: PreviewFile[];
  testEntry: string;
  handlersPath?: string;
}

/**
 * Seams for the unit test only. The browser always uses the defaults.
 * Node's fetch() rejects the relative harness URL and esbuild-wasm's
 * browser-only `wasmURL` init cannot run under Vitest, so the test swaps in
 * a disk read, a no-op init and real (Node) esbuild -- same version and
 * same build() API as esbuild-wasm.
 */
export interface BundleTestsDeps {
  init: () => Promise<void>;
  build: (options: esbuild.BuildOptions) => Promise<esbuild.BuildResult>;
  harnessSource: () => Promise<string>;
}

const defaultDeps: BundleTestsDeps = {
  init: ensureInitialised,
  build: (options) => esbuild.build(options),
  harnessSource: fetchHarnessSource,
};

export type BundleTestsResult =
  | { ok: true; code: string }
  | { ok: false; errors: PreviewBuildError[] };

export async function bundleTests(
  options: BundleTestsOptions,
  deps: BundleTestsDeps = defaultDeps,
): Promise<BundleTestsResult> {
  const map = new Map(options.files.map((f) => [f.path, f.content]));
  if (!map.has(options.testEntry)) {
    return {
      ok: false,
      errors: [{ file: options.testEntry, line: 0, column: 0, text: `Test entry "${options.testEntry}" is missing` }],
    };
  }

  // Cold esbuild-wasm init can take a long time on a first visit (see the
  // onLoaded comment in components/PreviewFrame.tsx); `npm test` typed
  // during that window must wait for it, not throw.
  await deps.init();

  map.set(HARNESS_VIRTUAL, await deps.harnessSource());
  map.set(
    SETUP_VIRTUAL,
    `import { createTestHarness } from './${HARNESS_VIRTUAL}';\nglobalThis.__debuglab_harness__ = createTestHarness();\n`,
  );
  if (options.handlersPath) {
    map.set(INTERCEPTOR_VIRTUAL, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${options.handlersPath}`));
    // Question files (e.g. server-sim/cartHandlers.js) import
    // '../__devtools__.js'; without this entry they fail to resolve.
    map.set(DEVTOOLS_VIRTUAL, devtoolsModuleFor(options.handlersPath));
  }
  map.set(
    ENTRY_VIRTUAL,
    // 'react' first, for the same reason as bundlePreview's entry: the
    // vendored react-dom/jsx-runtime read React off a global that only
    // react.js's own module body sets.
    `import 'react';\n` +
      (options.handlersPath ? `import './${INTERCEPTOR_VIRTUAL}';\n` : '') +
      `import './${SETUP_VIRTUAL}';\n` +
      `import './${options.testEntry}';\n\n` +
      `(async () => {\n` +
      `  try {\n` +
      `    const results = await globalThis.__debuglab_harness__.run();\n` +
      `    globalThis.__debuglab_test_report__(results);\n` +
      `  } catch (err) {\n` +
      `    globalThis.__debuglab_test_report__([\n` +
      `      { name: 'test file failed to load', passed: false, error: err instanceof Error ? err.message : String(err) },\n` +
      `    ]);\n` +
      `  }\n` +
      `})();\n`,
  );

  const virtual: esbuild.Plugin = {
    name: 'debuglab-test-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'entry-point') return { path: args.path, namespace: VIRTUAL_NAMESPACE };
        if (REACT_EXTERNALS.includes(args.path)) return { path: args.path, external: true };
        if (!args.path.startsWith('.')) return { path: args.path, external: true };
        const resolved = resolveRelative(args.importer, args.path, map);
        if (!resolved) {
          return { errors: [{ text: `Cannot resolve "${args.path}" from "${args.importer}"` }] };
        }
        return { path: resolved, namespace: VIRTUAL_NAMESPACE };
      });
      build.onLoad({ filter: /.*/, namespace: VIRTUAL_NAMESPACE }, (args) => ({
        contents: map.get(args.path) ?? '',
        loader: loaderFor(args.path),
      }));
    },
  };

  try {
    const result = await deps.build({
      entryPoints: [ENTRY_VIRTUAL],
      bundle: true,
      write: false,
      outdir: 'out',
      format: 'esm',
      jsx: 'automatic',
      target: 'es2022',
      logLevel: 'silent',
      define: { 'process.env.NODE_ENV': '"development"' },
      plugins: [virtual],
    });
    const code = result.outputFiles?.find((f) => f.path.endsWith('.js'))?.text;
    if (code === undefined) {
      return { ok: false, errors: [{ file: options.testEntry, line: 0, column: 0, text: 'Bundler produced no JavaScript output' }] };
    }
    return { ok: true, code };
  } catch (err) {
    const messages = (err as esbuild.BuildFailure).errors ?? [];
    if (messages.length === 0) {
      return { ok: false, errors: [{ file: options.testEntry, line: 0, column: 0, text: (err as Error).message }] };
    }
    return {
      ok: false,
      errors: messages.map((m) => ({
        file: stripNamespace(m.location?.file) ?? options.testEntry,
        line: m.location?.line ?? 0,
        column: m.location?.column ?? 0,
        text: stripNamespaceEverywhere(m.text),
      })),
    };
  }
}
