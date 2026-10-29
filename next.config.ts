import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // esbuild (the Node package) must never be pulled into a client bundle --
  // only esbuild-wasm belongs in the browser, used directly from the preview
  // bundler (src/preview/bundler.ts). It initialises its own internal worker;
  // we do not hand-write one (see docs/decisions.md D13).
  serverExternalPackages: ['esbuild'],

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
