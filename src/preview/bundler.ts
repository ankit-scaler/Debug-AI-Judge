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

let initialised: Promise<void> | null = null;

/** esbuild-wasm may only be initialised once per realm. */
function ensureInitialised(): Promise<void> {
  initialised ??= esbuild.initialize({ wasmURL: '/preview/esbuild.wasm' });
  return initialised;
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
