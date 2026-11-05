import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // esbuild (the Node package) must never be pulled into a client bundle --
  // only esbuild-wasm belongs in the browser, used directly from the preview
  // bundler (src/preview/bundler.ts). It initialises its own internal worker;
  // we do not hand-write one (see docs/decisions.md D13).
  //
  // esbuild-wasm also has to be listed here, for the opposite direction: it
  // is a client-only dependency, but SolveScreen.tsx ('use client') is still
  // server-rendered for its initial HTML, which pulls bundler.ts -- and so
  // esbuild-wasm -- into the SSR module graph. esbuild-wasm's module has a
  // Node child_process code path (for its CLI/native use) that Turbopack
  // cannot statically bundle for the server (the binary path it spawns is
  // only resolvable at runtime, not at build time). That code path is never
  // actually reached during SSR -- bundlePreview() only runs inside a
  // useEffect -- but the module still has to load without error for SSR to
  // produce the page at all. Marking it external makes Next.js `require()`
  // it directly at runtime instead of bundling it, which sidesteps the
  // static-resolution failure entirely. See D25.
  serverExternalPackages: ['esbuild', 'esbuild-wasm'],

  // src/grading/execute-tests.ts reads this file's raw text at REQUEST time
  // (`readFileSync`, to bundle it as a virtual module alongside a learner's
  // submission) rather than importing it -- it has to stay real, readable
  // TypeScript source, not compiled output. Next.js's build-time file tracer
  // (@vercel/nft) statically analyses `import`/`require`, but a `fs` read
  // built from `join(process.cwd(), ...)` is exactly the case its own docs
  // warn it can miss -- confirmed live: Submit on the deployed site crashed
  // every time with an empty 500 (ENOENT on this file, never reaching the
  // route's own error handling) until this was added. `/*` (every route) is
  // the documented pattern for "a file one specific route's trace missed";
  // the include itself stays narrow (one file, not a directory glob).
  //
  // esbuild itself is the other half of this same class of bug: it's listed
  // as a server-external package above (so Next.js require()s it directly
  // instead of bundling it via webpack/turbopack), and its real work happens
  // through a *native binary* that the package resolves to at a platform-
  // specific path at runtime (node_modules/@esbuild/<platform>-<arch>/bin/
  // esbuild) -- exactly the "native/runtime asset" shape the Next.js docs'
  // own outputFileTracingIncludes example calls out by name (their example
  // uses `sharp`/`aws-crt`; esbuild has the identical structure). A build-
  // time-only, per-OS-architecture binary that a route's own dependency
  // resolves to is precisely the kind of thing a static import/require
  // trace can under-include, so it's included explicitly here too, for the
  // same reason and by the same mechanism as the harness file above.
  outputFileTracingIncludes: {
    '/*': ['src/testing/browser-test-harness.ts', 'node_modules/@esbuild/**', 'node_modules/esbuild/**'],
  },

  async headers() {
    return [
      {
        // The preview iframe (public/preview/frame.html) is sandboxed with an
        // opaque origin on purpose, so it cannot reach the parent page. That
        // means every fetch it makes -- including to these same-host static
        // files -- is treated by the browser as cross-origin and needs an
        // explicit CORS allow, or the vendored React/esbuild.wasm/Monaco
        // assets fail to load with no useful error. These files carry no
        // secrets and are not question-specific, so an open CORS policy costs
        // nothing.
        source: '/preview/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      {
        source: '/monaco/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};

export default nextConfig;
