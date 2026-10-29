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
const buildMock = vi.fn();

vi.mock('esbuild-wasm', () => ({
  initialize: (...args: unknown[]) => initializeMock(...args),
  build: (...args: unknown[]) => buildMock(...args),
}));

beforeEach(() => {
  initializeMock.mockReset();
  initializeMock.mockResolvedValue(undefined);
  buildMock.mockReset();
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

// esbuild emits CSS as a SEPARATE output file, not inlined into the bundled
// JS -- confirmed empirically: a build of an app with one CSS import was
// probed directly and returned outputFiles.length === 2, one .js and one
// .css. The previous version of bundlePreview took only the .js entry,
// which built and ran without any error while silently dropping every
// stylesheet -- a question with styling simply rendered unstyled, with
// nothing in the build result or console to say why. This mock reproduces
// that exact observed shape so the extraction is pinned by a test, not by
// re-trusting the same assumption that caused the bug.
test('extracts CSS from the separate output file esbuild produces for it', async () => {
  buildMock.mockResolvedValue({
    outputFiles: [
      { path: '/out/__debuglab_entry__.js', text: 'console.log(1);' },
      { path: '/out/__debuglab_entry__.css', text: 'body{color:red}' },
    ],
    errors: [],
    warnings: [],
  });

  const mod = await freshBundlerModule();
  const result = await mod.bundlePreview({
    files: [{ path: 'a.jsx', content: "import './a.css';\nexport default () => null;" }],
    entry: 'a.jsx',
  });

  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.code).toBe('console.log(1);');
    expect(result.css).toBe('body{color:red}');
  }
});

test('css is an empty string, not undefined, when nothing was imported', async () => {
  buildMock.mockResolvedValue({
    outputFiles: [{ path: '/out/__debuglab_entry__.js', text: 'console.log(1);' }],
    errors: [],
    warnings: [],
  });

  const mod = await freshBundlerModule();
  const result = await mod.bundlePreview({
    files: [{ path: 'a.jsx', content: 'export default () => null;' }],
    entry: 'a.jsx',
  });

  expect(result.ok).toBe(true);
  if (result.ok) expect(result.css).toBe('');
});
