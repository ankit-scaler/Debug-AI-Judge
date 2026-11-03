// Mock API for this question. Read-only -- the simulated backend. One shared
// store + pricing service per run, matching the real lab's one `startApp()`
// per test-file run: state accumulates across requests within a run, exactly
// like a real server would, and resets only when the preview re-bundles.
import { createStore, PRODUCTS } from '../server-sim/db.js';
import { login, logout as logoutToken, userForToken, userIdForToken } from '../server-sim/auth.js';
import { createPricingService } from '../server-sim/pricing.js';
import { getCart, postItems, patchItem, deleteItem } from '../server-sim/cartHandlers.js';
import { postOrder } from '../server-sim/orderHandlers.js';

const store = createStore();
let pricing = createPricingService(store);

// Test-only hook (used by tests/resilience.test.js) to reproduce "the
// pricing service is down" without spinning up a second app instance, the
// way the real lab's test does with its own startApp({ pricing }).
export function __setPricingFailing(failing) {
  pricing = createPricingService(store, { failing });
}
export function __store() {
  return store;
}

function tokenFrom(req) {
  const header = req.headers?.Authorization || req.headers?.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

function auth(req) {
  const token = tokenFrom(req);
  return token ? userIdForToken(token) : null;
}

// Mirrors the real lab's asyncHandler middleware: a route handler that
// throws (for example when the pricing service is down) becomes a 500
// response, not an unhandled rejection that takes the whole preview down.
function safe(fn) {
  return async (req) => {
    try {
      return await fn(req);
    } catch (err) {
      return { status: 500, body: { error: 'INTERNAL' } };
    }
  };
}

function productIdHandlers(method, run) {
  return PRODUCTS.map((p) => ({
    method,
    path: `/api/cart/items/${p.id}`,
    handler: safe((req) => {
      const userId = auth(req);
      if (!userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      return run(userId, p.id, req.body ? JSON.parse(req.body) : undefined);
    }),
  }));
}

export const handlers = [
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: async (req) => {
      const { email, password } = JSON.parse(req.body);
      const session = login(email, password);
      if (!session) return { status: 401, body: { error: 'INVALID_CREDENTIALS' } };
      return { status: 200, body: { token: session.token, user: session.user } };
    },
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    handler: async (req) => {
      const user = userForToken(tokenFrom(req));
      if (!user) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      return { status: 200, body: { user } };
    },
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    handler: async (req) => {
      const token = tokenFrom(req);
      if (token) logoutToken(token);
      return { status: 200, body: { ok: true } };
    },
  },
  {
    method: 'GET',
    path: '/api/products',
    handler: async (req) => {
      // A fixed base, not `location.origin`: this file also runs inside the
      // server-side node:vm test execution, which has no `location` global.
      const url = new URL(req.url, 'http://localhost');
      const q = url.searchParams.get('q')?.toLowerCase();
      const category = url.searchParams.get('category');
      let products = store.products;
      if (q) products = products.filter((p) => p.name.toLowerCase().includes(q));
      if (category) products = products.filter((p) => p.category === category);
      return {
        status: 200,
        body: {
          products: products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.pricePaise,
            stock: p.stock,
          })),
        },
      };
    },
  },
  {
    method: 'GET',
    path: '/api/cart',
    handler: safe((req) => {
      const userId = auth(req);
      if (!userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      return getCart(store, userId);
    }),
  },
  {
    method: 'POST',
    path: '/api/cart/items',
    handler: safe(async (req) => {
      const userId = auth(req);
      if (!userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      return postItems(store, pricing, userId, req.body ? JSON.parse(req.body) : undefined);
    }),
  },
  ...productIdHandlers('PATCH', (userId, productId, body) => patchItem(store, userId, productId, body)),
  ...productIdHandlers('DELETE', (userId, productId) => deleteItem(store, userId, productId)),
  {
    method: 'POST',
    path: '/api/orders',
    handler: safe((req) => {
      const userId = auth(req);
      if (!userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      return postOrder(store, userId, req.body ? JSON.parse(req.body) : undefined);
    }),
  },
];
