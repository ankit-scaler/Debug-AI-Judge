// Resolved for every internal `require('react')` call inside the bundled
// react-dom-client.js and jsx-runtime.js vendor files, via esbuild's `alias`
// option -- not via marking 'react' external.
//
// Externalizing 'react' at the esbuild level (rewriting the specifier to a
// relative URL, leaving it unbundled) was the original approach, but it broke
// at runtime: react-dom's own CJS source calls require('react') internally,
// and esbuild cannot turn an internal CJS require() of an externalized module
// into a proper ESM import under format:'esm' -- it falls back to a runtime
// `__require` shim that only works in Node, producing
// `Error: Dynamic require of "./react.js" is not supported` in the browser.
// Confirmed live via the browser's own postMessage error report.
//
// Aliasing to this REAL (tiny) file instead means esbuild inlines a normal
// CommonJS module it fully understands, with its usual CJS-to-ESM interop
// machinery -- which handles that correctly. The single shared React instance
// still comes from one place: the vendored react.js file sets this global as
// a side effect, so react-dom-client.js and jsx-runtime.js read the exact
// same instance react.js exports, which is required for hooks/context to work.
module.exports = (typeof window !== 'undefined' && window.__DEBUGLAB_REACT__) || {};
