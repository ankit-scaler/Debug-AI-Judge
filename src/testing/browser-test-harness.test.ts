import { expect as vitestExpect, test } from 'vitest';
import { createTestHarness } from './browser-test-harness';

test('a passing test reports passed with no error', async () => {
  const h = createTestHarness();
  h.it('adds up', () => {
    h.expect(1 + 1).toBe(2);
  });
  const results = await h.run();
  vitestExpect(results).toEqual([{ name: 'adds up', passed: true, error: null }]);
});

test('a failing assertion reports the real failure message, not a generic one', async () => {
  const h = createTestHarness();
  h.it('is wrong', () => {
    h.expect(1 + 1).toBe(3);
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(false);
  vitestExpect(results[0]!.error).toMatch(/expected 2 to be 3/);
});

test('a thrown error (not just a failed assertion) is also captured as a failure', async () => {
  const h = createTestHarness();
  h.it('throws', () => {
    throw new Error('pricing service is down');
  });
  const results = await h.run();
  vitestExpect(results[0]).toEqual({ name: 'throws', passed: false, error: 'pricing service is down' });
});

test('async tests are awaited before recording a result', async () => {
  const h = createTestHarness();
  let resolved = false;
  h.it('waits', async () => {
    await new Promise((r) => setTimeout(r, 5));
    resolved = true;
    h.expect(resolved).toBe(true);
  });
  const results = await h.run();
  vitestExpect(resolved).toBe(true);
  vitestExpect(results[0]!.passed).toBe(true);
});

test('describe prefixes nested test names', async () => {
  const h = createTestHarness();
  h.describe('cart', () => {
    h.it('adds an item', () => {
      h.expect(true).toBe(true);
    });
  });
  const results = await h.run();
  vitestExpect(results[0]!.name).toBe('cart > adds an item');
});

test('before runs once before all tests, after runs once after all tests', async () => {
  const h = createTestHarness();
  const order: string[] = [];
  h.before(() => order.push('before'));
  h.after(() => order.push('after'));
  h.it('first', () => order.push('first'));
  h.it('second', () => order.push('second'));
  await h.run();
  vitestExpect(order).toEqual(['before', 'first', 'second', 'after']);
});

test('one failing test does not stop the rest from running', async () => {
  const h = createTestHarness();
  h.it('fails', () => h.expect(1).toBe(2));
  h.it('passes', () => h.expect(1).toBe(1));
  const results = await h.run();
  vitestExpect(results.map((r) => r.passed)).toEqual([false, true]);
});

test('toEqual does a deep comparison, not reference equality', async () => {
  const h = createTestHarness();
  h.it('deep equal arrays', () => {
    h.expect([{ id: 1 }, { id: 2 }]).toEqual([{ id: 1 }, { id: 2 }]);
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(true);
});

test('toEqual fails with a real diff-shaped message on mismatch', async () => {
  const h = createTestHarness();
  h.it('deep mismatch', () => {
    h.expect({ quantity: 1 }).toEqual({ quantity: 3 });
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(false);
  vitestExpect(results[0]!.error).toMatch(/quantity/);
});

test('toThrow passes when the function throws a message matching the pattern', async () => {
  const h = createTestHarness();
  h.it('rejects duplicates', () => {
    h.expect(() => {
      throw new Error('UNIQUE constraint failed: cart_items.cart_id, cart_items.product_id');
    }).toThrow(/UNIQUE/i);
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(true);
});

test('toThrow fails when the function does not throw', async () => {
  const h = createTestHarness();
  h.it('should have thrown', () => {
    h.expect(() => {}).toThrow();
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(false);
});

test('toThrow passes when an awaited async function rejects with a matching message', async () => {
  const h = createTestHarness();
  h.it('async reject', async () => {
    await h.expect(async () => {
      throw new Error('boom');
    }).toThrow(/boom/);
  });
  const results = await h.run();
  vitestExpect(results[0]!).toEqual({ name: 'async reject', passed: true, error: null });
});

test('toThrow fails when an awaited async function does not reject', async () => {
  const h = createTestHarness();
  h.it('async no-op', async () => {
    await h.expect(async () => {}).toThrow();
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(false);
});

test('toBeTruthy / toBeGreaterThan / toBeLessThan cover the rest of the real tests\' needs', async () => {
  const h = createTestHarness();
  h.it('matchers', () => {
    h.expect(1).toBeTruthy();
    h.expect(5).toBeGreaterThan(3);
    h.expect(2).toBeLessThan(3);
  });
  const results = await h.run();
  vitestExpect(results[0]!.passed).toBe(true);
});
