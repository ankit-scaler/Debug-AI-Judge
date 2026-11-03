// Ported from the real lab's tests/server/resilience.test.js. The real test
// spins up a second app instance with a broken pricing service; here the
// shared mock backend exposes a test-only toggle for the same scenario
// (see __setPricingFailing in mock/handlers.js).
import { __setPricingFailing } from '../mock/handlers.js';

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

it('an unexpected error inside add-to-cart gives a 500 and the server keeps running', async () => {
  const login = await api('POST', '/api/auth/login', {
    body: { email: 'asha@example.com', password: 'password123' },
  });
  const token = login.body.token;

  __setPricingFailing(true);
  try {
    const r = await api('POST', '/api/cart/items', { token, body: { productId: 42, quantity: 1 } });
    expect(r.status).toBe(500);
    expect(r.body.error).toBe('INTERNAL');
  } finally {
    __setPricingFailing(false);
  }

  // The "server" survived: the next request is still answered normally.
  const again = await api('GET', '/api/cart', { token });
  expect(again.status).toBe(200);
});
