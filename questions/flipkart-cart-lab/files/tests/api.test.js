// Ported from the real lab's tests/server/api.test.js -- trimmed to the
// assertions that exercise real app behaviour (PATCH/DELETE, product
// search). The original file's generic auth-edge-case tests (wrong
// password, unauthenticated 401, checkout-of-an-empty-cart) are not ported:
// they are not connected to any of this question's three bugs.
const { it, expect } = globalThis.__debuglab_harness__;

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

it('product search filters by text and category', async () => {
  const byText = await api('GET', '/api/products?q=yoga');
  expect(byText.body.products.map((p) => p.id)).toEqual([43, 50]);
  const byCat = await api('GET', '/api/products?category=Fitness');
  expect(byCat.body.products.map((p) => p.id)).toEqual([43, 49, 50]);
});

it('PATCH sets an exact quantity and DELETE removes the line', async () => {
  const t = await login();
  await api('POST', '/api/cart/items', { token: t, body: { productId: 44 } });
  const set = await api('PATCH', '/api/cart/items/44', { token: t, body: { quantity: 5 } });
  expect(set.body.items.find((i) => i.productId === 44)?.quantity).toBe(5);
  const del = await api('DELETE', '/api/cart/items/44', { token: t });
  expect(del.body.items.some((i) => i.productId === 44)).toBe(false);
});
