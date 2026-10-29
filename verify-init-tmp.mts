import * as esbuild from 'esbuild-wasm';

// Reproduce the exact failure: call initialize() twice, as HMR resetting a
// module-level `let` would cause.
console.log('=== confirming esbuild-wasm really throws on a second initialize() ===');
await esbuild.initialize({ wasmURL: undefined as never, worker: false });
try {
  await esbuild.initialize({ wasmURL: undefined as never, worker: false });
  console.log('UNEXPECTED: second call did not throw');
} catch (err) {
  console.log('CONFIRMED throws:', (err as Error).message);
}

// Now confirm the fix's catch logic: treating that specific message as success
// leaves esbuild fully usable.
console.log('\n=== confirming esbuild stays usable after the caught double-init ===');
const result = await esbuild.build({
  stdin: { contents: 'export const x = 1 + 1;', loader: 'js' },
  write: false,
  logLevel: 'silent',
});
console.log('build after caught double-init still works:', result.outputFiles[0]!.text.trim());
