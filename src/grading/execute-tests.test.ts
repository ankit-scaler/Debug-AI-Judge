import { expect, test } from 'vitest';
import { executeTests } from './execute-tests';

// Real esbuild, real node:vm -- no mocking. The whole point of this module is
// that it actually runs code; a mocked version of these tests would prove
// nothing about whether real execution works.

test('a passing test file reports a real pass', async () => {
  const result = await executeTests(
    [
      {
        path: 'tests/sum.test.js',
        content: `
          const { it, expect } = globalThis.__debuglab_harness__;
          it('adds', () => {
            expect(1 + 1).toBe(2);
          });
        `,
      },
    ],
    'tests/sum.test.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'adds', passed: true, error: null }],
  });
});

test('a failing assertion against the learner\'s actual (buggy) code reports the real message', async () => {
  const result = await executeTests(
    [
      { path: 'src/add.js', content: 'export function add(a, b) { return a - b; }' }, // bug: subtracts
      {
        path: 'tests/sum.test.js',
        content: `
          import { add } from '../src/add.js';
          const { it, expect } = globalThis.__debuglab_harness__;
          it('adds two numbers', () => {
            expect(add(2, 3)).toBe(5);
          });
        `,
      },
    ],
    'tests/sum.test.js',
  );
  expect(result.status).toBe('ran');
  if (result.status !== 'ran') throw new Error('unreachable');
  expect(result.tests).toEqual([
    { name: 'adds two numbers', passed: false, error: 'expected -1 to be 5' },
  ]);
});

test('the same test file reports a real pass once the (now-fixed) source is swapped in', async () => {
  const result = await executeTests(
    [
      { path: 'src/add.js', content: 'export function add(a, b) { return a + b; }' }, // fixed
      {
        path: 'tests/sum.test.js',
        content: `
          import { add } from '../src/add.js';
          const { it, expect } = globalThis.__debuglab_harness__;
          it('adds two numbers', () => {
            expect(add(2, 3)).toBe(5);
          });
        `,
      },
    ],
    'tests/sum.test.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'adds two numbers', passed: true, error: null }],
  });
});

test('a missing test entry fails the build, never reaching execution', async () => {
  const result = await executeTests([{ path: 'src/a.js', content: '' }], 'tests/missing.test.js');
  expect(result.status).toBe('build_failed');
});

test('an unresolved import in the test file is a build failure, not a silent crash', async () => {
  const result = await executeTests(
    [{ path: 'tests/a.test.js', content: "import { x } from './nope.js';" }],
    'tests/a.test.js',
  );
  expect(result.status).toBe('build_failed');
});

test('a never-resolving async hang is killed by the wall-clock timeout, not left to hang the request', async () => {
  const result = await executeTests(
    [
      {
        path: 'tests/hang.test.js',
        content: `
          const { it } = globalThis.__debuglab_harness__;
          it('never resolves', async () => {
            await new Promise(() => {});
          });
        `,
      },
    ],
    'tests/hang.test.js',
    undefined,
    200,
  );
  expect(result).toEqual({ status: 'timed_out' });
}, 10000);

test('tests can exercise real async timing (setTimeout works inside the vm)', async () => {
  const result = await executeTests(
    [
      {
        path: 'tests/async.test.js',
        content: `
          const { it, expect } = globalThis.__debuglab_harness__;
          it('waits then resolves', async () => {
            const value = await new Promise((resolve) => setTimeout(() => resolve(42), 10));
            expect(value).toBe(42);
          });
        `,
      },
    ],
    'tests/async.test.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'waits then resolves', passed: true, error: null }],
  });
});

test('localStorage is available inside the vm as an in-memory shim', async () => {
  const result = await executeTests(
    [
      {
        path: 'tests/storage.test.js',
        content: `
          const { it, expect } = globalThis.__debuglab_harness__;
          it('round-trips a token', () => {
            localStorage.setItem('fk_token', 'abc');
            expect(localStorage.getItem('fk_token')).toBe('abc');
          });
        `,
      },
    ],
    'tests/storage.test.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'round-trips a token', passed: true, error: null }],
  });
});

test('a ported test\'s fetch() calls are intercepted by the question\'s mock handlers, same as the browser preview', async () => {
  const result = await executeTests(
    [
      {
        path: 'mock/handlers.js',
        content: `
          export const handlers = [
            {
              method: 'POST',
              path: '/api/echo',
              handler: async (req) => ({ status: 200, body: { got: JSON.parse(req.body).value * 2 } }),
            },
          ];
        `,
      },
      {
        path: 'tests/echo.test.js',
        content: `
          const { it, expect } = globalThis.__debuglab_harness__;
          it('hits the mocked backend through a real fetch() call', async () => {
            const res = await fetch('/api/echo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: 21 }),
            });
            const data = await res.json();
            expect(data.got).toBe(42);
          });
        `,
      },
    ],
    'tests/echo.test.js',
    'mock/handlers.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'hits the mocked backend through a real fetch() call', passed: true, error: null }],
  });
});

test('require and process are not exposed inside the vm context', async () => {
  const result = await executeTests(
    [
      {
        path: 'tests/escape.test.js',
        content: `
          const { it, expect } = globalThis.__debuglab_harness__;
          it('cannot see process', () => {
            expect(typeof process).toBe('undefined');
          });
        `,
      },
    ],
    'tests/escape.test.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'cannot see process', passed: true, error: null }],
  });
});

test('a question file importing ../__devtools__.js builds and runs under Submit', async () => {
  const result = await executeTests(
    [
      {
        path: 'mock/handlers.js',
        content: `import { add } from '../server-sim/cart.js';
          export const handlers = [];
          export const terminalHandlers = { x: () => add() };`,
      },
      {
        path: 'server-sim/cart.js',
        content: `import { serverLog } from '../__devtools__.js';
          export function add() { serverLog('info', 'add called'); return 2; }`,
      },
      {
        path: 'tests/cart.test.js',
        content: `
          import { add } from '../server-sim/cart.js';
          const { it, expect } = globalThis.__debuglab_harness__;
          it('add still works with serverLog inside it', () => {
            expect(add()).toBe(2);
          });
        `,
      },
    ],
    'tests/cart.test.js',
    'mock/handlers.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'add still works with serverLog inside it', passed: true, error: null }],
  });
});
