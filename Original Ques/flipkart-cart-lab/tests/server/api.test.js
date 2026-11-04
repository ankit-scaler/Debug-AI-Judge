import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startApp } from './helpers.js';

let ctx;
before(async () => (ctx = await startApp()));
after(() => ctx.close());

test('cart endpoints require authentication', async () => {
  const r = await ctx.api('GET', '/api/cart');
  assert.equal(r.status, 401);
});

test('login rejects a wrong password', async () => {
  const r = await ctx.api('POST', '/api/auth/login', {
    body: { email: 'asha@example.com', password: 'nope' },
  });
  assert.equal(r.status, 401);
});

test('product search filters by text and category', async () => {
  const byText = await ctx.api('GET', '/api/products?q=yoga');
  assert.deepEqual(byText.body.products.map((p) => p.id), [43]);
  const byCat = await ctx.api('GET', '/api/products?category=Fitness');
  assert.deepEqual(byCat.body.products.map((p) => p.id), [43, 49]);
});

test('PATCH sets an exact quantity and DELETE removes the line', async () => {
  const t = await ctx.login();
  await ctx.api('POST', '/api/cart/items', { token: t, body: { productId: 44 } });
  const set = await ctx.api('PATCH', '/api/cart/items/44', { token: t, body: { quantity: 5 } });
  assert.equal(set.body.itemCount, 5);
  const del = await ctx.api('DELETE', '/api/cart/items/44', { token: t });
  assert.equal(del.body.items.length, 0);
});

test('checkout of an empty cart is rejected', async () => {
  const t = await ctx.login('ravi@example.com');
  const r = await ctx.api('POST', '/api/orders', { token: t, body: { address: '1 Test Street' } });
  assert.equal(r.status, 400);
});
