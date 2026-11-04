// Mock API for this question. Read-only -- the simulated backend. One shared
// store + pricing service per run, matching the real lab's one `startApp()`
// per test-file run: state accumulates across requests within a run, exactly
// like a real server would, and resets only when the preview re-bundles.
import { createStore, PRODUCTS, USERS } from '../server-sim/db.js';
import { login, logout as logoutToken, userForToken, userIdForToken } from '../server-sim/auth.js';
import { createPricingService } from '../server-sim/pricing.js';
import { getCart, postItems, patchItem, deleteItem } from '../server-sim/cartHandlers.js';
import { postOrder } from '../server-sim/orderHandlers.js';
import { __setFetchOverride } from '../src/api.js';
import { serverLog } from '../__devtools__.js';

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
      // Without this, a thrown error is invisible everywhere -- the learner
      // sees only "Something went wrong" in the UI and a 500 in Network,
      // with nothing in Logs to point at why. serverLog is what the
      // description promises ("you'll see it in the Logs tab").
      serverLog('error', `${req.method} ${req.url}: ${err instanceof Error ? err.message : String(err)}`);
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
  {
    method: 'GET',
    path: '/api/orders',
    handler: safe((req) => {
      const userId = auth(req);
      if (!userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      const orders = store.orders
        .filter((o) => o.userId === userId)
        .slice()
        .reverse()
        .map((o) => ({ id: o.id, address: o.address, total: o.totalPaise, items: o.items }));
      return { status: 200, body: { orders } };
    }),
  },
];

// --- Terminal commands (the Terminal tab's `npm run repro -- <scenario>` and
// `npm run db:inspect`). Ports of the reference lab's scripts/repro.js and
// scripts/db.js. Every request below is a REAL fetch() through the same
// interceptor the app uses, so each one shows up in the Network tab
// (Timeline view shows arrival order) and in the Logs tab's Server filter,
// exactly like the reference's repro script sends real HTTP requests.
// Called lazily by src/preview/devtools-source.ts when a learner types the
// command -- never at module-evaluation time.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const YOGA_MAT = 43;
const DUMBBELL_SET = 49;

async function call(method, path, token, body) {
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

async function loginAs(email) {
  const r = await call('POST', '/api/auth/login', null, { email, password: 'password123' });
  return r.body.token;
}

/** Same as the reference: start every scenario from an empty cart so earlier runs can't change the numbers. */
async function emptyCart(token) {
  const cart = (await call('GET', '/api/cart', token)).body;
  for (const id of new Set(cart.items.map((i) => i.productId))) {
    await call('PATCH', `/api/cart/items/${id}`, token, { quantity: 0 });
  }
}

/**
 * Fires `n` add-to-cart requests 60ms apart (a fast triple tap) and records
 * them in ARRIVAL order: each request pushes its own result the moment IT
 * resolves. (Promise.all's result array is in call order -- formatting that
 * as "arrival order" would hide the very thing this command exists to show.)
 */
async function burst(token, productId, n) {
  const jobs = [];
  const arrived = [];
  for (let i = 0; i < n; i++) {
    const sentAs = i + 1;
    jobs.push(
      call('POST', '/api/cart/items', token, { productId, quantity: 1 }).then((r) => {
        arrived.push({ ...r, sentAs });
      }),
    );
    await sleep(60);
  }
  await Promise.all(jobs);
  return arrived;
}

function arrivalLines(arrived) {
  return arrived.map(
    (r, i) =>
      `  arrived #${i + 1}: tap ${r.sentAs} -> HTTP ${r.status}` +
      (r.body.version !== undefined
        ? `, cart v${r.body.version}, itemCount ${r.body.itemCount}, ${r.body.items.length} line(s)`
        : `, ${r.body.error}`),
  );
}

function cartIdFor(email) {
  const user = USERS.find((u) => u.email === email);
  return store.carts.find((c) => c.userId === user.id)?.id;
}

function rowsFor(email, productId) {
  const cartId = cartIdFor(email);
  return store.cartItems.filter((ci) => ci.cartId === cartId && ci.productId === productId);
}

function table(columns, rows) {
  if (rows.length === 0) return '  (no rows)';
  const cells = [columns, ...rows.map((r) => columns.map((c) => String(r[c] ?? '')))];
  const widths = columns.map((_, i) => Math.max(...cells.map((row) => row[i].length)));
  return cells.map((row) => '  ' + row.map((cell, i) => cell.padEnd(widths[i])).join('  ')).join('\n');
}

const LEFT_IN_PLACE =
  'The rows from this run were left in the store on purpose -- look at them with: npm run db:inspect\n' +
  "The running app's badge is not told about requests it didn't make; press Run to start over from a fresh store.";

async function reproStale() {
  // Problem 1 lives in the CLIENT (CartContext's mutate), so this one drives
  // the real running app: it clicks the real Add to cart button and watches
  // the real badge. A direct server-side call would never touch the client.
  //
  // pricing's BURST_DELAYS_MS[callIndex % 3] (server-sim/pricing.js) advances
  // across the store's WHOLE life, not per burst -- without resetting it here,
  // this repro's delay pattern (and therefore its arrival order) depends on
  // how many pricing.quote() calls happened before it, including from earlier
  // repro runs or normal app use. Recreating it gives every run the same
  // 800/450/100ms sequence starting from callIndex 0.
  pricing = createPricingService(store);

  const button = document.querySelector(`[data-testid="add-to-cart-${YOGA_MAT}"]`);
  const badge = document.querySelector('[data-testid="cart-count"]');
  const loggedIn = [...document.querySelectorAll('.site-header button')].some((b) =>
    b.textContent.startsWith('Logout'),
  );
  if (!button || !badge || !loggedIn) {
    throw new Error(
      'npm run repro -- stale drives the running app: log in, stay on the catalog page (Yoga Mat visible), then run it again.',
    );
  }

  const token = await loginAs('asha@example.com');
  await emptyCart(token);

  // A simulated slow network, the same condition as the reference lab's
  // LATENCY=lab mode: the server handles the three adds one after another
  // (v1, v2, v3 -- so Problem 2's race cannot interfere here), but their
  // responses are handed back to the app NEWEST FIRST. Uses api.js's
  // existing test-only __setFetchOverride hook (the same one
  // tests/CartContext.test.jsx uses); restored in `finally`.
  const held = [];
  let serverQueue = Promise.resolve();
  let sent = 0;
  __setFetchOverride((path, init) => {
    if (!(init && init.method === 'POST' && path === '/api/cart/items')) return fetch(path, init);
    const sentAs = ++sent;
    const authed = { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } };
    const response = serverQueue.then(() => fetch(path, authed));
    serverQueue = response.then(
      () => {},
      () => {},
    );
    return new Promise((resolve, reject) => held.push({ sentAs, response, resolve, reject }));
  });

  const badgeHistory = [badge.textContent];
  const observer = new MutationObserver(() => {
    if (badge.textContent !== badgeHistory[badgeHistory.length - 1]) badgeHistory.push(badge.textContent);
  });
  observer.observe(badge, { childList: true, characterData: true, subtree: true });

  const arrived = [];
  try {
    for (let i = 0; i < 3; i++) {
      button.click();
      await sleep(60);
    }
    for (let waited = 0; held.length < 3; waited += 20) {
      if (waited > 5000) throw new Error('the app did not send 3 add-to-cart requests -- is the Yoga Mat button enabled?');
      await sleep(20);
    }
    for (const h of [...held].reverse()) {
      const res = await h.response;
      arrived.push({ sentAs: h.sentAs, status: res.status, body: await res.clone().json() });
      h.resolve(res);
      await sleep(150); // let React render this response before the next one lands
    }
  } finally {
    __setFetchOverride(null);
    observer.disconnect();
  }

  const server = (await call('GET', '/api/cart', token)).body;
  const shown = badge.textContent;
  return [
    'Problem 1: 3 rapid adds of Yoga Mat (Asha), responses delivered newest-first',
    ...arrivalLines(arrived),
    `  badge over time: ${badgeHistory.join(' -> ')}`,
    `  server cart now: v${server.version}, itemCount ${server.itemCount}`,
    String(server.itemCount) === shown
      ? `  OK: the badge settled on ${shown}, matching the server.`
      : `  BUG: the badge settled on ${shown}, but the server holds ${server.itemCount} -- an older response overwrote a newer one.`,
  ].join('\n');
}

async function reproDup() {
  pricing = createPricingService(store); // see reproStale's comment: resets BURST_DELAYS_MS to callIndex 0
  const token = await loginAs('asha@example.com');
  await emptyCart(token);
  const arrived = await burst(token, YOGA_MAT, 3);
  const rows = rowsFor('asha@example.com', YOGA_MAT);
  const cart = (await call('GET', '/api/cart', token)).body;
  return [
    'Problem 2: 3 rapid adds of Yoga Mat (Asha, stock 5)',
    ...arrivalLines(arrived),
    'cart_items rows for Yoga Mat (expected: ONE row with quantity 3):',
    table(['id', 'cartId', 'productId', 'quantity'], rows),
    `GET /api/cart (what a page refresh shows): ${cart.items.length} line(s), itemCount ${cart.itemCount}`,
    LEFT_IN_PLACE,
  ].join('\n');
}

async function reproStock() {
  pricing = createPricingService(store); // see reproStale's comment: resets BURST_DELAYS_MS to callIndex 0
  const token = await loginAs('ravi@example.com');
  await emptyCart(token);
  const arrived = await burst(token, DUMBBELL_SET, 5);
  const total = rowsFor('ravi@example.com', DUMBBELL_SET).reduce((n, r) => n + r.quantity, 0);
  return [
    'Problem 3: 5 rapid adds of Dumbbell Set (Ravi, stock 3)',
    ...arrivalLines(arrived),
    `Units of Dumbbell Set in the cart: ${total} (stock is 3, so at most 3 may be accepted; the rest should get HTTP 409)`,
    LEFT_IN_PLACE,
  ].join('\n');
}

function dbInspect() {
  const items = [...store.cartItems]
    .sort((a, b) => a.id - b.id)
    .map((ci) => {
      const cart = store.carts.find((c) => c.id === ci.cartId);
      const user = USERS.find((u) => u.id === cart?.userId);
      const product = store.products.find((p) => p.id === ci.productId);
      return { id: ci.id, user: user?.email, productId: ci.productId, name: product?.name, quantity: ci.quantity, stock: product?.stock };
    });
  const groups = new Map();
  for (const ci of store.cartItems) {
    const key = `${ci.cartId}:${ci.productId}`;
    const g = groups.get(key) ?? { cartId: ci.cartId, productId: ci.productId, rows: 0, totalQty: 0 };
    g.rows += 1;
    g.totalQty += ci.quantity;
    groups.set(key, g);
  }
  const duplicates = [...groups.values()].filter((g) => g.rows > 1);
  return [
    'cart_items  (one row per product per cart is what we expect)',
    table(['id', 'user', 'productId', 'name', 'quantity', 'stock'], items),
    '',
    'rows per (cart, product)  -> anything above 1 is a duplicate line',
    table(['cartId', 'productId', 'rows', 'totalQty'], duplicates),
    '',
    'carts',
    table(['id', 'userId', 'version'], store.carts),
  ].join('\n');
}

export const terminalHandlers = {
  'repro-stale': reproStale,
  'repro-dup': reproDup,
  'repro-stock': reproStock,
  'db-inspect': dbInspect,
};
