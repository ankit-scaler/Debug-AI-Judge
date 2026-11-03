/**
 * A hand-rolled `describe`/`it`/`expect` runner, small enough to bundle into
 * both the learner's preview iframe (fast, un-scored "Run tests") and the
 * server's `node:vm` execution context (scored Submit) -- see
 * src/grading/execute-tests.ts. Deliberately not vitest/node:test themselves:
 * neither is meant to run inside a bundled iframe or a bare vm context, and
 * the real ported test files only ever use the handful of assertions
 * implemented here (equal, deep-equal, throws, truthy, comparisons).
 */

export interface TestResult {
  name: string;
  passed: boolean;
  error: string | null;
}

// Returning anything (not just void) is allowed deliberately: real ported
// test bodies often end in an expression statement, and `await`ing a
// non-Promise value is a no-op, so this stays ergonomic without needing every
// callback wrapped to force a void return.
type TestFn = () => unknown;
type HookFn = () => unknown;

function stringify(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) =>
    deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
  );
}

export interface Expectation<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeTruthy(): void;
  toBeGreaterThan(expected: number): void;
  toBeLessThan(expected: number): void;
  /** For an async function, this returns a Promise the caller must await (e.g. `await expect(f).toThrow()`); a sync function's throw is checked immediately and returns nothing to await. */
  toThrow(pattern?: RegExp | string): void | Promise<void>;
}

export function createTestHarness() {
  const tests: { name: string; fn: TestFn }[] = [];
  const beforeAllFns: HookFn[] = [];
  const afterAllFns: HookFn[] = [];
  let suiteStack: string[] = [];

  function describe(name: string, fn: () => void): void {
    suiteStack.push(name);
    try {
      fn();
    } finally {
      suiteStack.pop();
    }
  }

  function it(name: string, fn: TestFn): void {
    const fullName = suiteStack.length > 0 ? `${suiteStack.join(' > ')} > ${name}` : name;
    tests.push({ name: fullName, fn });
  }

  function before(fn: HookFn): void {
    beforeAllFns.push(fn);
  }

  function after(fn: HookFn): void {
    afterAllFns.push(fn);
  }

  function expect<T>(actual: T): Expectation<T> {
    return {
      toBe(expected) {
        if (!Object.is(actual, expected)) {
          throw new Error(`expected ${stringify(actual)} to be ${stringify(expected)}`);
        }
      },
      toEqual(expected) {
        if (!deepEqual(actual, expected)) {
          throw new Error(`expected ${stringify(actual)} to equal ${stringify(expected)}`);
        }
      },
      toBeTruthy() {
        if (!actual) throw new Error(`expected ${stringify(actual)} to be truthy`);
      },
      toBeGreaterThan(expected) {
        if (!((actual as unknown as number) > expected)) {
          throw new Error(`expected ${stringify(actual)} to be greater than ${stringify(expected)}`);
        }
      },
      toBeLessThan(expected) {
        if (!((actual as unknown as number) < expected)) {
          throw new Error(`expected ${stringify(actual)} to be less than ${stringify(expected)}`);
        }
      },
      toThrow(pattern) {
        if (typeof actual !== 'function') {
          throw new Error('toThrow() needs a function to call');
        }

        const checkMessage = (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          if (pattern !== undefined) {
            const matches = typeof pattern === 'string' ? message.includes(pattern) : pattern.test(message);
            if (!matches) {
              throw new Error(`expected thrown message ${stringify(message)} to match ${String(pattern)}`);
            }
          }
        };

        let result: unknown;
        try {
          result = (actual as () => unknown)();
        } catch (err) {
          // Threw synchronously -- the common case for a plain function.
          checkMessage(err);
          return;
        }

        if (result && typeof (result as Promise<unknown>).then === 'function') {
          // An async function throwing is a rejected promise, not a
          // synchronous throw -- nothing above catches it. The caller must
          // await this (e.g. `await expect(asyncFn).toThrow()`); an
          // unawaited call here cannot report anything back in time.
          return (result as Promise<unknown>).then(
            () => {
              throw new Error('expected function to throw, but it did not');
            },
            (err) => {
              checkMessage(err);
            },
          );
        }

        throw new Error('expected function to throw, but it did not');
      },
    };
  }

  async function run(): Promise<TestResult[]> {
    for (const fn of beforeAllFns) await fn();
    const results: TestResult[] = [];
    for (const t of tests) {
      try {
        await t.fn();
        results.push({ name: t.name, passed: true, error: null });
      } catch (err) {
        results.push({
          name: t.name,
          passed: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    for (const fn of afterAllFns) await fn();
    return results;
  }

  return { describe, it, before, after, expect, run };
}
