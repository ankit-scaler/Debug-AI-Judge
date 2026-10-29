import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The preview bundler runs esbuild-wasm inside a web worker. Nothing special is
  // needed for the worker itself, but esbuild must never be pulled into a client
  // bundle -- only esbuild-wasm belongs on the client, and only in the worker.
  serverExternalPackages: ['esbuild'],
};

export default nextConfig;
