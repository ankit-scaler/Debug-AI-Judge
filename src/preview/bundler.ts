import * as esbuild from 'esbuild-wasm';
import {
  loaderFor,
  resolveRelative,
  stripNamespace,
  stripNamespaceEverywhere,
  VIRTUAL_NAMESPACE,
} from '../bundling/resolve';
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
  | { ok: true; code: string }
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

function reportToServer(event: string, payload: unknown): void {
  // Fire-and-forget. If this fails (e.g. the dev server isn't the local one),
  // the preview must still work -- this is diagnostics, not a dependency.
  try {
    void fetch('/api/debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...(payload as object) }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
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

  // Pairing check: the bundler is only ever as correct as its inputs, and a
  // path/content mismatch here would surface as a baffling resolve error in an
  // unrelated file. Reported to the server log so it is readable without
  // DevTools -- see app/api/debug/log/route.ts.
  reportToServer('bundling', {
    entry: options.entry,
    handlersPath: options.handlersPath,
    files: options.files.map((f) => ({
      path: f.path,
      bytes: f.content.length,
      startsWith: f.content.slice(0, 50),
    })),
  });

  // The interceptor must patch fetch before the app evaluates. Module bodies run
  // in import order, so importing it first in the entry is what guarantees that.
  const imports: string[] = [];
  if (options.handlersPath) {
    map.set(INTERCEPTOR, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${options.handlersPath}`));
    imports.push(`import './${INTERCEPTOR}';`);
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
          const importerContent = map.get(args.importer);
          reportToServer('unresolved-import', {
            specifier: args.path,
            importer: args.importer,
            importerLoaded: map.has(args.importer),
            importerStartsWith: importerContent?.slice(0, 80) ?? null,
            available,
          });
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
    const code = result.outputFiles?.find((f) => f.path.endsWith('.js'))?.text;
    if (code === undefined) {
      return { ok: false, errors: [{ file: options.entry, line: 0, column: 0, text: 'Bundler produced no JavaScript output' }] };
    }
    return { ok: true, code };
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
