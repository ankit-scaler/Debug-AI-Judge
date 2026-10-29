import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// esbuild-wasm's `initialize()` throws "Cannot call initialize more than once"
// on a second real call. In the browser, editing this module during development
// triggers Hot Module Replacement, which re-evaluates bundler.ts and would reset
// a plain module-level `let` guard back to null -- while the underlying library
// (loaded from node_modules, never hot-reloaded) still remembers it already
// initialised, so the reset guard calls the real initialize() again and it
// throws. Reproduced against the real library in a one-off script before this
// test was written; see the commit message for that evidence.
const initializeMock = vi.fn();

vi.mock('esbuild-wasm', () => ({
  initialize: (...args: unknown[]) => initializeMock(...args),
  build: vi.fn(),
}));

beforeEach(() => {
  initializeMock.mockReset();
  delete (globalThis as Record<string, unknown>).__debuglabEsbuildInit;
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__debuglabEsbuildInit;
});

async function freshBundlerModule() {
  // Simulates what HMR does to this file: the module is re-evaluated, so any
  // state held in a local `let` is gone. globalThis is not touched by this --
  // exactly like the real library's state surviving a re-evaluated caller.
  vi.resetModules();
  return import('./bundler.js');
}

test('a second import of this module does not call initialize() again', async () => {
  initializeMock.mockResolvedValue(undefined);

  const first = await freshBundlerModule();
  await first.bundlePreview({ files: [{ path: 'a.js', content: 'export {}' }], entry: 'a.js' });
  expect(initializeMock).toHaveBeenCalledTimes(1);

  const second = await freshBundlerModule();
  await second.bundlePreview({ files: [{ path: 'a.js', content: 'export {}' }], entry: 'a.js' });
  expect(initializeMock).toHaveBeenCalledTimes(1);
});

test('a stray "more than once" rejection is treated as already-initialised, not a failure', async () => {
  initializeMock.mockRejectedValue(new Error('Cannot call "initialize" more than once'));

  const mod = await freshBundlerModule();
  await expect(
    mod.bundlePreview({ files: [{ path: 'a.js', content: 'export {}' }], entry: 'a.js' }),
  ).resolves.toBeDefined();
});

test('a genuine initialize failure is not cached, so a retry is possible', async () => {
  initializeMock.mockRejectedValueOnce(new Error('Failed to fetch /preview/esbuild.wasm'));
  initializeMock.mockResolvedValueOnce(undefined);

  const mod = await freshBundlerModule();
  await expect(
    mod.bundlePreview({ files: [{ path: 'a.js', content: 'export {}' }], entry: 'a.js' }),
  ).rejects.toThrow(/Failed to fetch/);

  // A later call must retry rather than replay the cached failure.
  await mod.bundlePreview({ files: [{ path: 'a.js', content: 'export {}' }], entry: 'a.js' });
  expect(initializeMock).toHaveBeenCalledTimes(2);
});
