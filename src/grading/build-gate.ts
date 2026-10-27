import * as esbuild from 'esbuild';
import type { SubmittedFile } from '../types.js';

export interface BuildError {
  file: string;
  line: number;
  column: number;
  text: string;
}

export type BuildResult = { ok: true } | { ok: false; errors: BuildError[] };

const EXTENSIONS = [
  '',
  '.jsx',
  '.js',
  '.tsx',
  '.ts',
  '/index.jsx',
  '/index.js',
  '/index.tsx',
  '/index.ts',
];

const DATAURL_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2'];
const TEXT_EXTENSIONS = ['.md', '.txt', '.html'];

function loaderFor(path: string): esbuild.Loader {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'ts';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.css')) return 'css';
  if (DATAURL_EXTENSIONS.some((e) => path.endsWith(e))) return 'dataurl';
  if (TEXT_EXTENSIONS.some((e) => path.endsWith(e))) return 'text';
  if (/\.(jsx|js|mjs|cjs)$/.test(path)) return 'jsx';
  // Anything else contributes nothing rather than being parsed as code. Guessing
  // 'jsx' made an SVG prologue or a Markdown heading look like a syntax error in a
  // file the learner cannot even open.
  return 'empty';
}

function resolveRelative(
  importer: string,
  specifier: string,
  files: Map<string, string>,
): string | undefined {
  const base = importer.split('/').slice(0, -1);
  const parts = specifier.split('/');
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') base.pop();
    else base.push(part);
  }
  const joined = base.join('/');
  for (const ext of EXTENSIONS) {
    if (files.has(joined + ext)) return joined + ext;
  }
  return undefined;
}

function stripNamespace(file: string | undefined): string | undefined {
  if (file === undefined) return undefined;
  return file.startsWith('virtual:') ? file.slice('virtual:'.length) : file;
}

/** esbuild also embeds the namespaced path inside message text, not just location.file. */
function stripNamespaceEverywhere(text: string): string {
  return text.replaceAll('virtual:', '');
}

export async function buildCheck(
  files: SubmittedFile[],
  entry: string,
): Promise<BuildResult> {
  const map = new Map(files.map((f) => [f.path, f.content]));
  if (!map.has(entry)) {
    return { ok: false, errors: [{ file: entry, line: 0, column: 0, text: `Entry file "${entry}" is missing` }] };
  }

  const virtual: esbuild.Plugin = {
    name: 'debuglab-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'entry-point') return { path: args.path, namespace: 'virtual' };
        if (!args.path.startsWith('.')) return { path: args.path, external: true };
        const resolved = resolveRelative(args.importer, args.path, map);
        if (!resolved) {
          return { errors: [{ text: `Cannot resolve "${args.path}" from "${args.importer}"` }] };
        }
        return { path: resolved, namespace: 'virtual' };
      });
      build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => ({
        contents: map.get(args.path) ?? '',
        loader: loaderFor(args.path),
      }));
    },
  };

  try {
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      write: false,
      // Required even with write:false: without an output path esbuild refuses to
      // emit a second output file, so any JS importing CSS is a hard error.
      // Nothing is written to disk.
      outdir: 'out',
      logLevel: 'silent',
      format: 'esm',
      jsx: 'automatic',
      plugins: [virtual],
    });
    return { ok: true };
  } catch (err) {
    const messages = (err as esbuild.BuildFailure).errors ?? [];
    return {
      ok: false,
      errors: messages.map((m) => ({
        // esbuild prefixes paths with the plugin namespace ("virtual:src/App.jsx").
        // Learners must see their own path, not our bundler internals.
        file: stripNamespace(m.location?.file) ?? entry,
        line: m.location?.line ?? 0,
        column: m.location?.column ?? 0,
        text: stripNamespaceEverywhere(m.text),
      })),
    };
  }
}
