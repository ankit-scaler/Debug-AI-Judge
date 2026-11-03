import * as realEsbuild from 'esbuild';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { bundleTests, type BundleTestsDeps } from './test-bundler';

// Real esbuild (Node), not a mock: the point is proving the assembled file
// set actually bundles -- harness loader, virtual paths, __devtools__.js
// resolution. esbuild-wasm itself cannot initialise under Vitest (its
// wasmURL option is browser-only), so the browser-only pieces are swapped
// for their Node equivalents. Same esbuild version as esbuild-wasm
// (package.json pins both to the same release), same build() API.
const deps: BundleTestsDeps = {
  init: async () => {},
  build: realEsbuild.build as unknown as BundleTestsDeps['build'],
  harnessSource: async () =>
    readFileSync(join(process.cwd(), 'src/testing/browser-test-harness.ts'), 'utf8'),
};

describe('bundleTests', () => {
  test('bundles a test file plus the real (TypeScript) harness into one script', async () => {
    const result = await bundleTests(
      {
        files: [
          {
            path: 'tests/example.test.js',
            content: `
              const { it, expect } = globalThis.__debuglab_harness__;
              it('adds up', () => expect(1 + 1).toBe(2));
            `,
          },
        ],
        testEntry: 'tests/example.test.js',
      },
      deps,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.code).toContain('adds up');
      expect(result.code).toContain('__debuglab_test_report__');
    }
  });

  test('a question file importing ../__devtools__.js resolves when handlersPath is set', async () => {
    const result = await bundleTests(
      {
        files: [
          { path: 'mock/handlers.js', content: `import '../server-sim/thing.js';\nexport const handlers = [];` },
          {
            path: 'server-sim/thing.js',
            content: `import { serverLog } from '../__devtools__.js';\nexport function f() { serverLog('info', 'hi'); }`,
          },
          {
            path: 'tests/example.test.js',
            content: `
              import { f } from '../server-sim/thing.js';
              const { it } = globalThis.__debuglab_harness__;
              it('calls f', () => f());
            `,
          },
        ],
        testEntry: 'tests/example.test.js',
        handlersPath: 'mock/handlers.js',
      },
      deps,
    );
    expect(result).toMatchObject({ ok: true });
  });

  test('a missing testEntry reports a build failure, not a crash', async () => {
    const result = await bundleTests({ files: [], testEntry: 'tests/missing.test.js' }, deps);
    expect(result).toEqual({
      ok: false,
      errors: [{ file: 'tests/missing.test.js', line: 0, column: 0, text: 'Test entry "tests/missing.test.js" is missing' }],
    });
  });

  test('a syntax error in reachable code reports the learner-facing path, not a crash', async () => {
    const result = await bundleTests(
      {
        files: [
          { path: 'src/broken.js', content: 'export const x = ;' },
          { path: 'tests/example.test.js', content: `import '../src/broken.js';` },
        ],
        testEntry: 'tests/example.test.js',
      },
      deps,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]?.file).toBe('src/broken.js');
  });
});
