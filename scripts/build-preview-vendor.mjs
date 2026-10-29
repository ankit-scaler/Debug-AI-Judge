/**
 * Prepares everything the preview iframe needs, locally. No CDN.
 *
 * React 19 ships CJS entry points, so a browser module cannot import it directly.
 * We bundle it with the Node esbuild we already depend on, into three separate ESM
 * files -- one per bare specifier the learner's bundle will import. Three files
 * rather than one because `react` and `react/jsx-runtime` both export `Fragment`,
 * and a single re-export file would collide on it.
 *
 * Also copies esbuild.wasm out of node_modules so the preview worker can fetch it.
 */
import { cp, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, 'public', 'preview', 'vendor');

const TARGETS = [
  { file: 'react.js', specifier: 'react', externaliseReact: false },
  { file: 'jsx-runtime.js', specifier: 'react/jsx-runtime', externaliseReact: true },
  { file: 'react-dom-client.js', specifier: 'react-dom/client', externaliseReact: true },
];

/**
 * Externalises ONLY the exact specifier `react`, rewritten to a relative URL.
 *
 * `external: ['react']` cannot be used here: esbuild also matches subpaths with
 * it, so `react/jsx-runtime` was left external inside jsx-runtime.js -- which the
 * import map then resolves straight back to that same file. An infinite import
 * loop. Rewriting to './react.js' also means the vendor files do not depend on
 * the import map at all; only the learner's bundle does.
 */
const externaliseExactReact = {
  name: 'externalise-exact-react',
  setup(build) {
    build.onResolve({ filter: /^react$/ }, () => ({ path: './react.js', external: true }));
  },
};

await mkdir(outDir, { recursive: true });

for (const target of TARGETS) {
  const result = await esbuild.build({
    stdin: {
      contents: `export * from '${target.specifier}';\nexport { default } from '${target.specifier}';\n`,
      resolveDir: root,
      loader: 'js',
      sourcefile: `vendor-${target.file}`,
    },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    plugins: target.externaliseReact ? [externaliseExactReact] : [],
    // React picks its dev or prod build from this. Dev gives learners real error
    // messages in the preview instead of minified codes.
    define: { 'process.env.NODE_ENV': '"development"' },
    outfile: join(outDir, target.file),
    logLevel: 'warning',
  });
  if (result.errors.length > 0) {
    console.error(result.errors);
    process.exit(1);
  }
  console.log(`vendored ${target.specifier} -> public/preview/vendor/${target.file}`);
}

await copyFile(
  join(root, 'node_modules', 'esbuild-wasm', 'esbuild.wasm'),
  join(root, 'public', 'preview', 'esbuild.wasm'),
);
console.log('copied esbuild.wasm -> public/preview/esbuild.wasm');

// Monaco ships an AMD build that its own loader can fetch at runtime. Self-hosting
// it keeps the editor working offline and avoids the CDN that @monaco-editor/react
// would otherwise default to. Bundler-specific worker plumbing is not needed.
await cp(join(root, 'node_modules', 'monaco-editor', 'min', 'vs'), join(root, 'public', 'monaco', 'vs'), {
  recursive: true,
});
console.log('copied monaco AMD build -> public/monaco/vs');

// The preview frame's import map is hand-written; make sure it still points at
// files that exist, so a rename here cannot silently break the preview.
const frame = await readFile(join(root, 'public', 'preview', 'frame.html'), 'utf8');
for (const target of TARGETS) {
  if (!frame.includes(`./vendor/${target.file}`)) {
    console.error(
      `public/preview/frame.html does not reference ./vendor/${target.file} -- ` +
        `its import map is out of sync with this script.`,
    );
    process.exit(1);
  }
}
console.log('frame.html import map verified against vendored files');
