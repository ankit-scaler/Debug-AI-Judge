import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startApp, cartRows } from './helpers.js';

let ctx;
let token;
before(async () => {
  ctx = await startApp();
  token = await ctx.login();
});
after(() => ctx.close());

const add = (productId, quantity = 1, t = token) =>
  ctx.api('POST', '/api/cart/items', { token: t, body: { productId, quantity } });

test('a single add puts one line with quantity 1 in the cart', async () => {
  const r = await add(42);
  assert.equal(r.status, 200);
  assert.equal(r.body.itemCount, 1);
  assert.equal(r.body.items.length, 1);
  assert.equal(r.body.subtotal, 249900);
});

test('three rapid adds of the same product give ONE line with quantity 3', async () => {
  const t = await ctx.login('ravi@example.com');
  const results = await Promise.all([add(43, 1, t), add(43, 1, t), add(43, 1, t)]);
  assert.ok(results.every((r) => r.status === 200));

  const rows = cartRows(ctx.db, 'ravi@example.com').filter((r) => r.productId === 43);
  assert.equal(rows.length, 1, `expected one cart_items row for product 43, got ${rows.length}`);
  assert.equal(rows[0].quantity, 3);

  const cart = await ctx.api('GET', '/api/cart', { token: t });
  assert.equal(cart.body.itemCount, 3);
});

test('rapid adds on top of an existing line do not lose increments', async () => {
  // product 42 already has quantity 1 for Asha from the first test
  await Promise.all([add(42), add(42), add(42)]);
  const rows = cartRows(ctx.db).filter((r) => r.productId === 42);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].quantity, 4);
});

test('concurrent adds can never oversell the available stock', async () => {
  // product 49 has stock 3
  const t = await ctx.login('ravi@example.com');
  const results = await Promise.all(Array.from({ length: 5 }, () => add(49, 1, t)));
  const ok = results.filter((r) => r.status === 200).length;
  const conflict = results.filter((r) => r.status === 409).length;
  assert.equal(ok, 3, 'exactly 3 adds should succeed');
  assert.equal(conflict, 2, 'the other 2 should get 409 OUT_OF_STOCK');
  const total = cartRows(ctx.db, 'ravi@example.com')
    .filter((r) => r.productId === 49)
    .reduce((n, r) => n + r.quantity, 0);
  assert.equal(total, 3);
});

test('cart version increases by one per accepted mutation', async () => {
  const t = await ctx.login('ravi@example.com');
  const before = (await ctx.api('GET', '/api/cart', { token: t })).body.version;
  await Promise.all([add(45, 1, t), add(45, 1, t), add(46, 1, t)]);
  const after = (await ctx.api('GET', '/api/cart', { token: t })).body.version;
  assert.equal(after - before, 3);
});

test('the database itself rejects duplicate (cart, product) lines', () => {
  const cartId = ctx.db.prepare('SELECT id FROM carts LIMIT 1').get().id;
  const insert = () =>
    ctx.db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, 50, 1)').run(cartId);
  insert();
  assert.throws(insert, /UNIQUE/i);
});

test('checkout charges exactly what the cart shows and decrements stock', async () => {
  const t = await ctx.login('asha@example.com');
  const cart = (await ctx.api('GET', '/api/cart', { token: t })).body;
  const stockBefore = ctx.db.prepare('SELECT stock FROM products WHERE id = 42').get().stock;
  const order = await ctx.api('POST', '/api/orders', {
    token: t,
    body: { address: '12 MG Road, Bengaluru' },
  });
  assert.equal(order.status, 201);
  assert.equal(order.body.order.total, cart.subtotal);
  const stockAfter = ctx.db.prepare('SELECT stock FROM products WHERE id = 42').get().stock;
  assert.equal(stockBefore - stockAfter, 4);
});
