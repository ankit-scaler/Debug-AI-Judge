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
