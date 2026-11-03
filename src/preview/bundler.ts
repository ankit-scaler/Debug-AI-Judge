import * as esbuild from 'esbuild-wasm';
import {
  loaderFor,
  resolveRelative,
  stripNamespace,
  stripNamespaceEverywhere,
  VIRTUAL_NAMESPACE,
} from '../bundling/resolve';
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from './devtools-source';
import { INTERCEPTOR_MODULE } from './interceptor-source';

export interface PreviewFile {
  path: string;
  content: string;
}

export interface PreviewBuildError {
  file: string;
  line: number;
  column: number;
  text: string;
}

export type PreviewBundle =
  | { ok: true; code: string; css: string }
  | { ok: false; errors: PreviewBuildError[] };

const ENTRY = '__debuglab_entry__.js';
const INTERCEPTOR = '__debuglab_interceptor__.js';
const MOUNT = '__debuglab_mount__.jsx';

/**
 * React is left bare so the preview frame's import map resolves it to the
 * vendored copy. All three specifiers must stay external or the learner's bundle
 * would carry a second React instance and hooks would break.
 */
const REACT_EXTERNALS = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'];

/**
 * esbuild-wasm may only be initialised once per browser realm. A plain
 * module-level `let` is not enough: editing this file during development
 * triggers Hot Module Replacement, which re-evaluates the module and resets a
 * local variable back to null -- while the real esbuild-wasm instance, loaded
 * from node_modules and never hot-reloaded, still remembers it already
 * initialised. The guard then calls `initialize()` a second time for real,
 * and esbuild-wasm's own idempotency check throws "Cannot call initialize
 * more than once". Parking the promise on globalThis survives HMR; catching
 * that exact message is the fallback for any other path that double-calls it.
 */
const GLOBAL_KEY = '__debuglabEsbuildInit';
type GlobalWithInit = typeof globalThis & { [GLOBAL_KEY]?: Promise<void> };

function ensureInitialised(): Promise<void> {
  const g = globalThis as GlobalWithInit;
  g[GLOBAL_KEY] ??= esbuild.initialize({ wasmURL: '/preview/esbuild.wasm' }).catch((err) => {
    if (err instanceof Error && err.message.includes('more than once')) {
      return; // esbuild-wasm itself confirms it is already usable.
    }
    delete g[GLOBAL_KEY]; // a real failure must be retryable, not cached.
    throw err;
  });
  return g[GLOBAL_KEY];
}

export interface BundleOptions {
  files: PreviewFile[];
  /** The question's entry component, e.g. "src/App.jsx". Must default-export it. */
  entry: string;
  /** The question's mock handler module, when it has one, e.g. "mock/handlers.js". */
  handlersPath?: string;
}

export async function bundlePreview(options: BundleOptions): Promise<PreviewBundle> {
  await ensureInitialised();

  const map = new Map(options.files.map((f) => [f.path, f.content]));

  // 'react' must be the first module to evaluate, full stop. react-dom/client
  // and react/jsx-runtime's vendor bundles read React off a shared global
  // (window.__DEBUGLAB_REACT__) that only react.js's own module body sets --
  // see scripts/preview-react-shim.cjs. Explicitly importing it first, ahead
  // of even the interceptor, guarantees that global exists before anything
  // that depends on it runs. Leaving this to import order alone is exactly
  // what broke before: the mount file's first import was 'react-dom/client',
  // which evaluated before anything had imported bare 'react' at all.
  const imports: string[] = [`import 'react';`];
  if (options.handlersPath) {
    map.set(INTERCEPTOR, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${options.handlersPath}`));
    imports.push(`import './${INTERCEPTOR}';`);
    // Imported from the entry even when no question file imports it, so the
    // terminal-run listener exists in every preview with a mock backend.
    map.set(DEVTOOLS_VIRTUAL, devtoolsModuleFor(options.handlersPath));
    imports.push(`import './${DEVTOOLS_VIRTUAL}';`);
  }

  map.set(
    MOUNT,
    `import { createRoot } from 'react-dom/client';\n` +
      `import App from './${options.entry}';\n` +
      `const el = document.getElementById('root');\n` +
      `createRoot(el).render(<App />);\n`,
  );
  imports.push(`import './${MOUNT}';`);
  map.set(ENTRY, imports.join('\n') + '\n');

  const virtual: esbuild.Plugin = {
    name: 'debuglab-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'entry-point') return { path: args.path, namespace: VIRTUAL_NAMESPACE };
        if (REACT_EXTERNALS.includes(args.path)) return { path: args.path, external: true };
        if (!args.path.startsWith('.')) return { path: args.path, external: true };
        const resolved = resolveRelative(args.importer, args.path, map);
        if (!resolved) {
          // Say what was actually available. A bare "cannot resolve" forces
          // whoever hits this to guess at the file set, and the file set is the
          // one thing they cannot see.
          const available = [...map.keys()].filter((k) => !k.startsWith('__debuglab')).sort();
          return {
            errors: [
              {
                text:
                  `Cannot resolve "${args.path}" from "${args.importer}". ` +
                  `Files in this question: ${available.join(', ')}`,
              },
            ],
          };
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
    const result = await esbuild.build({
      entryPoints: [ENTRY],
      bundle: true,
      write: false,
      // Required even with write:false, so a stylesheet import can emit.
      outdir: 'out',
      format: 'esm',
      jsx: 'automatic',
      target: 'es2022',
      logLevel: 'silent',
      define: { 'process.env.NODE_ENV': '"development"' },
      plugins: [virtual],
    });
    // esbuild emits CSS as a SEPARATE output file, not inlined into the JS --
    // confirmed by direct inspection (a build with one CSS import produces
    // outputFiles.length === 2). Grabbing only the .js entry, as this used
    // to, built and ran without error but silently dropped every stylesheet:
    // the bundle was fine, the page was just never styled. css defaults to
    // '' when a question imports none, which is the common case.
    const code = result.outputFiles?.find((f) => f.path.endsWith('.js'))?.text;
    const css = result.outputFiles?.find((f) => f.path.endsWith('.css'))?.text ?? '';
    if (code === undefined) {
      return { ok: false, errors: [{ file: options.entry, line: 0, column: 0, text: 'Bundler produced no JavaScript output' }] };
    }
    return { ok: true, code, css };
  } catch (err) {
    const messages = (err as esbuild.BuildFailure).errors ?? [];
    if (messages.length === 0) {
      return {
        ok: false,
        errors: [{ file: options.entry, line: 0, column: 0, text: (err as Error).message }],
      };
    }
    return {
      ok: false,
      errors: messages.map((m) => ({
        file: stripNamespace(m.location?.file) ?? options.entry,
        line: m.location?.line ?? 0,
        column: m.location?.column ?? 0,
        text: stripNamespaceEverywhere(m.text),
      })),
    };
  }
}
