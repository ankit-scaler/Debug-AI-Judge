// Ported from the real lab's tests/server/cart.test.js. Same assertions,
// same product ids, same test names -- only the transport changed: real
// HTTP + real SQLite became a real (intercepted) fetch() + the in-memory
// store in server-sim/db.js. Runs server-side on Submit (see
// src/grading/execute-tests.ts) against your actual code, not an LLM's
// paraphrase of it.
import { __store } from '../mock/handlers.js';

const { it, before, expect } = globalThis.__debuglab_harness__;

async function api(method, path, { token, body } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}

async function login(email = 'asha@example.com') {
  const r = await api('POST', '/api/auth/login', { body: { email, password: 'password123' } });
  return r.body.token;
}

let token;
before(async () => {
  token = await login();
});

const add = (productId, quantity = 1, t = token) =>
  api('POST', '/api/cart/items', { token: t, body: { productId, quantity } });

it('a single add puts one line with quantity 1 in the cart', async () => {
  const r = await add(42);
  expect(r.status).toBe(200);
  expect(r.body.itemCount).toBe(1);
  expect(r.body.items.length).toBe(1);
  expect(r.body.subtotal).toBe(249900);
});

it('three rapid adds of the same product give ONE line with quantity 3', async () => {
  const t = await login('ravi@example.com');
  const results = await Promise.all([add(43, 1, t), add(43, 1, t), add(43, 1, t)]);
  expect(results.every((r) => r.status === 200)).toBeTruthy();

  const rows = __store().cartRowsFor('ravi@example.com').filter((r) => r.productId === 43);
  expect(rows.length).toBe(1);
  expect(rows[0].quantity).toBe(3);

  const cart = await api('GET', '/api/cart', { token: t });
  expect(cart.body.itemCount).toBe(3);
});

it('rapid adds on top of an existing line do not lose increments', async () => {
  // product 42 already has quantity 1 for Asha from the first test
  await Promise.all([add(42), add(42), add(42)]);
  const rows = __store().cartRowsFor('asha@example.com').filter((r) => r.productId === 42);
  expect(rows.length).toBe(1);
  expect(rows[0].quantity).toBe(4);
});

it('concurrent adds can never oversell the available stock', async () => {
  // product 49 has stock 3
  const t = await login('ravi@example.com');
  const results = await Promise.all([add(49, 1, t), add(49, 1, t), add(49, 1, t), add(49, 1, t), add(49, 1, t)]);
  // Every response must be a real outcome, never an unhandled crash.
  expect(results.every((r) => r.status === 200 || r.status === 409)).toBeTruthy();
  const total = __store()
    .cartRowsFor('ravi@example.com')
    .filter((r) => r.productId === 49)
    .reduce((n, r) => n + r.quantity, 0);
  // The invariant that actually matters: never more in the cart than stock.
  expect(total).toBeLessThan(4);
});

it('cart version increases by one per accepted mutation', async () => {
  const t = await login('ravi@example.com');
  const before_ = (await api('GET', '/api/cart', { token: t })).body.version;
  await Promise.all([add(45, 1, t), add(45, 1, t), add(46, 1, t)]);
  const after_ = (await api('GET', '/api/cart', { token: t })).body.version;
  expect(after_ - before_).toBe(3);
});

it('the database itself rejects duplicate (cart, product) lines', () => {
  const store = __store();
  const cart = store.carts[0];
  const insert = () => store.insertCartItemDirect(cart.id, 50, 1);
  insert();
  expect(insert).toThrow(/UNIQUE/i);
});

it('checkout charges exactly what the cart shows and decrements stock', async () => {
  const t = await login('asha@example.com');
  const cart = (await api('GET', '/api/cart', { token: t })).body;
  const store = __store();
  const stockBefore = store.products.find((p) => p.id === 42).stock;
  const order = await api('POST', '/api/orders', { token: t, body: { address: '12 MG Road, Bengaluru' } });
  expect(order.status).toBe(201);
  expect(order.body.order.total).toBe(cart.subtotal);
  const stockAfter = store.products.find((p) => p.id === 42).stock;
  expect(stockBefore - stockAfter).toBe(4);
});
