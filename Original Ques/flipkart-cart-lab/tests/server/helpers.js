import { openDb } from '../../server/db.js';
import { seed } from '../../server/seed.js';
import { createApp } from '../../server/app.js';

export async function startApp({ pricing } = {}) {
  const db = openDb(':memory:');
  seed(db);
  const app = createApp(db, { jitter: false, pricing });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  async function api(method, path, { token, body, signal } = {}) {
    const res = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
    return { status: res.status, body: await res.json() };
  }

  async function login(email = 'asha@example.com') {
    const r = await api('POST', '/api/auth/login', { body: { email, password: 'password123' } });
    return r.body.token;
  }

  const close = () =>
    new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections(); // don't wait for a hung request
    });

  return { db, api, login, close };
}

/** Rows in the DB for a user's cart, grouped for easy assertions. */
export function cartRows(db, email = 'asha@example.com') {
  return db
    .prepare(
      `SELECT ci.product_id AS productId, ci.quantity
         FROM cart_items ci
         JOIN carts c ON c.id = ci.cart_id
         JOIN users u ON u.id = c.user_id
        WHERE u.email = ?
        ORDER BY ci.id`
    )
    .all(email);
}
