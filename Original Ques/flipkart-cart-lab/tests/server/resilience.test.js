import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startApp } from './helpers.js';

test('an unexpected error inside add-to-cart gives a 500 and the server keeps running', async () => {
  // Stands in for any failure after the `await` (a pricing outage, a database constraint error...).
  const brokenPricing = {
    async quote() {
      throw new Error('pricing service is down');
    },
  };
  const ctx = await startApp({ pricing: brokenPricing });
  const logError = console.error;
  console.error = () => {}; // the app logs the error; keep the test output clean
  try {
    const token = await ctx.login();
    // The timeout makes a hung request fail the test instead of freezing the whole test run.
    const r = await ctx.api('POST', '/api/cart/items', {
      token,
      body: { productId: 42, quantity: 1 },
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(r.status, 500);
    assert.equal(r.body.error, 'INTERNAL');
    // The process survived: the next request is still answered.
    const again = await ctx.api('GET', '/api/cart', { token });
    assert.equal(again.status, 200);
  } finally {
    console.error = logError;
    await ctx.close();
  }
});
