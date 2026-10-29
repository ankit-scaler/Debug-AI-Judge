/**
 * Module resolution for the in-memory file sets we bundle.
 *
 * Shared deliberately between the server-side build gate (`esbuild`) and the
 * browser preview worker (`esbuild-wasm`). If these two disagreed, a submission
 * could preview fine and then fail the build gate, or the reverse, and the
 * learner would have no way to understand why.
 *
 * The loader union is declared here rather than imported from esbuild so this
 * module stays free of any Node-only import; both esbuild builds accept these
 * exact strings.
 */
export type BundleLoader =
  | 'tsx'
  | 'ts'
  | 'jsx'
  | 'json'
  | 'css'
  | 'dataurl'
  | 'text'
  | 'empty';

export const EXTENSIONS = [
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

const DATAURL_EXTENSIONS = [
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
];
const TEXT_EXTENSIONS = ['.md', '.txt', '.html'];

export function loaderFor(path: string): BundleLoader {
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

export function resolveRelative(
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

/** esbuild prefixes paths with the plugin namespace ("virtual:src/App.jsx"). */
export const VIRTUAL_NAMESPACE = 'virtual';

export function stripNamespace(file: string | undefined): string | undefined {
  if (file === undefined) return undefined;
  const prefix = `${VIRTUAL_NAMESPACE}:`;
  return file.startsWith(prefix) ? file.slice(prefix.length) : file;
}

/** esbuild also embeds the namespaced path inside message text, not just location.file. */
export function stripNamespaceEverywhere(text: string): string {
  return text.replaceAll(`${VIRTUAL_NAMESPACE}:`, '');
}
