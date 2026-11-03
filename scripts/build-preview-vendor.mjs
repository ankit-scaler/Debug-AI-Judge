/**
 * Prepares everything the preview iframe needs, locally. No CDN.
 *
 * React 19 ships CJS entry points, so a browser module cannot import it
 * directly. We bundle it with the Node esbuild we already depend on, into
 * three separate ESM files -- one per bare specifier the learner's bundle
 * will import.
 *
 * Each vendor file is written as an explicit runtime destructure of the
 * resolved CJS module's own properties, not `export * from '<pkg>'`. React's
 * package entry points (react.js, react-dom/client.js, react/jsx-runtime.js)
 * all do `module.exports = require(NODE_ENV === 'production' ? A : B)` --
 * esbuild cannot statically see through that conditional require to know
 * what names the real module exports, so `export *` silently produces only a
 * `default` export and drops every named export (createContext, useState,
 * createRoot, jsx, ...). Confirmed live: `export * from 'react'` built
 * without error, but the browser then threw "The requested module 'react'
 * does not provide an export named 'createContext'" the moment real code
 * tried to use it. Destructuring off the resolved default at runtime doesn't
 * depend on esbuild's static CJS analysis at all, so it can't hit this again
 * regardless of how the upstream package structures its entry point.
 *
 * Also copies esbuild.wasm and the Monaco AMD build out of node_modules.
 */
import { cp, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, 'public', 'preview', 'vendor');

const TARGETS = [
  {
    file: 'react.js',
    specifier: 'react',
    sharesReact: false,
    // Every named export on React 19's public API. Destructuring a name that
    // does not exist on the resolved object just yields `undefined` for that
    // binding -- not a build error -- so it is safe to list generously.
    names: [
      'Children', 'Component', 'Fragment', 'Profiler', 'PureComponent',
      'StrictMode', 'Suspense', 'cloneElement', 'createContext',
      'createElement', 'createRef', 'forwardRef', 'isValidElement', 'lazy',
      'memo', 'startTransition', 'unstable_act', 'act', 'version',
      'useCallback', 'useContext', 'useDebugValue', 'useDeferredValue',
      'useEffect', 'useId', 'useImperativeHandle', 'useInsertionEffect',
      'useLayoutEffect', 'useMemo', 'useReducer', 'useRef', 'useState',
      'useSyncExternalStore', 'useTransition', 'use', 'useActionState',
      'useOptimistic',
    ],
  },
  {
    file: 'jsx-runtime.js',
    specifier: 'react/jsx-runtime',
    sharesReact: true,
    names: ['jsx', 'jsxs', 'Fragment'],
  },
  {
    file: 'react-dom-client.js',
    specifier: 'react-dom/client',
    sharesReact: true,
    names: ['createRoot', 'hydrateRoot'],
  },
];

const reactShimPath = join(root, 'scripts', 'preview-react-shim.cjs');

/**
 * Resolves ONLY the exact specifier `react` to the real shim file, inlined
 * (not external). esbuild's `alias` option matches path-like prefixes, so
 * `alias: { react: shimPath }` also rewrote `react/jsx-runtime` to
 * `<shimPath>/jsx-runtime` and broke resolution -- the same subpath-matching
 * trap as the external-based attempt before it. An explicit plugin matching
 * `/^react$/` is the only way to get exact-specifier-only resolution.
 */
const shareReactViaGlobal = {
  name: 'share-react-via-global',
  setup(build) {
    build.onResolve({ filter: /^react$/ }, () => ({ path: reactShimPath }));
  },
};

await mkdir(outDir, { recursive: true });

for (const target of TARGETS) {
  const destructure = target.names.map((n) => `  ${n}`).join(',\n');
  const result = await esbuild.build({
    stdin: {
      contents:
        `import __vendorDefault from '${target.specifier}';\n` +
        `const __vendorResolved = __vendorDefault && __vendorDefault.default ? __vendorDefault.default : __vendorDefault;\n` +
        `export default __vendorResolved;\n` +
        `export const {\n${destructure}\n} = __vendorResolved;\n` +
        (target.sharesReact
          ? ''
          : `if (typeof window !== 'undefined') { window.__DEBUGLAB_REACT__ = __vendorResolved; }\n`),
      resolveDir: root,
      loader: 'js',
      sourcefile: `vendor-${target.file}`,
    },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    // See scripts/preview-react-shim.cjs for why this is an alias to a real
    // inlined file, not external:true -- react-dom/jsx-runtime's own CJS
    // source calls require('react') internally, which esbuild cannot turn
    // into a working ESM import for an externalized module; it falls back to
    // a runtime require() shim that does not exist in a browser.
    plugins: target.sharesReact ? [shareReactViaGlobal] : [],
    // React picks its dev or prod build from this. Dev gives learners real
    // error messages in the preview instead of minified codes.
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

// src/testing/browser-test-harness.ts has zero imports, so its raw text is
// all `npm test` (src/preview/test-bundler.ts) needs -- esbuild-wasm
// transpiles it as a virtual .ts file, exactly as execute-tests.ts does with
// readFileSync on the server. A browser cannot readFileSync, so bake the text
// into a static asset instead. Regenerated on every `npm run dev`; after
// editing the harness mid-session, re-run `npm run build:preview`.
const harnessSource = await readFile(join(root, 'src', 'testing', 'browser-test-harness.ts'), 'utf8');
await writeFile(join(outDir, 'harness-source.txt'), harnessSource);
console.log('copied browser-test-harness.ts -> public/preview/vendor/harness-source.txt');

await copyFile(
  join(root, 'node_modules', 'esbuild-wasm', 'esbuild.wasm'),
  join(root, 'public', 'preview', 'esbuild.wasm'),
);
console.log('copied esbuild.wasm -> public/preview/esbuild.wasm');

await cp(join(root, 'node_modules', 'monaco-editor', 'min', 'vs'), join(root, 'public', 'monaco', 'vs'), {
  recursive: true,
});
console.log('copied monaco AMD build -> public/monaco/vs');

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
