// Reproduces the cart bugs on demand, with no clicking required.
// Needs the API running:  npm run dev   (or npm run dev:server)
//   npm run repro            -> runs all three scenarios
//   npm run repro -- dup     -> only one of: dup | stock | stale
//
// Each scenario first empties the cart of the demo user it uses (asha for problems 1 and 2, ravi for problem 3),
// so you can run it as often as you like. The rows it creates are LEFT in the database on purpose:
// look at them with `npm run db:inspect`.
import Database from 'better-sqlite3';
import { DEFAULT_DB_FILE } from '../server/db.js';

const BASE = process.env.API || 'http://localhost:3001';
const only = process.argv[2];
const db = () => new Database(process.env.DB_FILE || DEFAULT_DB_FILE, { readonly: true });

async function call(method, path, token, body) {
  const t0 = Date.now();
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json(), ms: Date.now() - t0, seq: res.headers.get('x-request-seq') };
}

async function login(email) {
  const r = await call('POST', '/api/auth/login', null, { email, password: 'password123' });
  return r.body.token;
}

/** Fire `n` add-to-cart requests ~60 ms apart (a fast human double/triple tap). */
async function burst(token, productId, n) {
  const jobs = [];
  const done = []; // responses in ARRIVAL order
  for (let i = 0; i < n; i++) {
    const job = call('POST', '/api/cart/items', token, { productId, quantity: 1 }).then((r) => {
      done.push({ ...r, sentAs: i + 1 });
    });
    job.catch(() => {}); // a dropped connection must not crash this script; Promise.all below still reports it
    jobs.push(job);
    await new Promise((r) => setTimeout(r, 60));
  }
  await Promise.all(jobs);
  return done;
}

function printArrivals(done) {
  console.table(
    done.map((r, i) => ({
      'arrived #': i + 1,
      'tap # (sent as)': r.sentAs,
      http: r.status,
      'cart version': r.body.version ?? '-',
      'itemCount in response': r.body.itemCount ?? r.body.error,
      'lines in response': r.body.items?.length ?? '-',
    }))
  );
}

function dbLines(email, productId) {
  const d = db();
  const rows = d
    .prepare(
      `SELECT ci.id, ci.product_id, ci.quantity FROM cart_items ci
         JOIN carts c ON c.id = ci.cart_id JOIN users u ON u.id = c.user_id
        WHERE u.email = ? AND ci.product_id = ? ORDER BY ci.id`
    )
    .all(email, productId);
  d.close();
  return rows;
}

/** Start every scenario from an empty cart, so earlier runs cannot change the numbers. */
async function emptyCart(token) {
  const cart = (await call('GET', '/api/cart', token)).body;
  for (const id of new Set(cart.items.map((i) => i.productId))) {
    await call('PATCH', `/api/cart/items/${id}`, token, { quantity: 0 });
  }
}

async function scenarioStale() {
  console.log('\n=== Problem 1: the cart badge shows the wrong number (responses arrive out of order) ===');
  const t = await login('asha@example.com');
  await emptyCart(t);
  console.log('Tapping "Add to cart" 3x on Steel Water Bottle (stock 20)...');
  const done = await burst(t, 45, 3);
  printArrivals(done);
  const last = done[done.length - 1];
  const newest = done.reduce((a, b) => (b.body.version > a.body.version ? b : a));
  console.log(`A client that applies responses in arrival order ends on the LAST one to arrive -> badge ${last.body.itemCount} (cart v${last.body.version}).`);
  console.log(`The newest snapshot (highest version) is v${newest.body.version} -> itemCount ${newest.body.itemCount}. A correct client should end up showing that one.`);
}

async function scenarioDup() {
  console.log('\n=== Problem 2: refresh shows duplicate cart lines / wrong quantity ===');
  const t = await login('asha@example.com');
  await emptyCart(t);
  console.log('Tapping "Add to cart" 3x on Yoga Mat (stock 5)...');
  const done = await burst(t, 43, 3);
  printArrivals(done);
  const rows = dbLines('asha@example.com', 43);
  console.log('\ncart_items rows for Yoga Mat in the database (expected: ONE row with quantity 3):');
  console.table(rows);
  const cart = (await call('GET', '/api/cart', t)).body;
  console.log(`GET /api/cart (what a page refresh shows): ${cart.items.length} line(s), itemCount ${cart.itemCount}`);
}

async function scenarioStock() {
  console.log('\n=== Problem 3: more items in the cart than are in stock (overselling) ===');
  const t = await login('ravi@example.com');
  await emptyCart(t);
  console.log('Dumbbell Set has stock 3. Tapping "Add to cart" 5x...');
  const done = await burst(t, 49, 5);
  printArrivals(done);
  const total = dbLines('ravi@example.com', 49).reduce((n, r) => n + r.quantity, 0);
  console.log(`\nUnits of Dumbbell Set in the cart: ${total}  (stock is 3, so at most 3 may be accepted; the other taps should get HTTP 409)`);
}

try {
  if (!only || only === 'stale') await scenarioStale();
  if (!only || only === 'dup') await scenarioDup();
  if (!only || only === 'stock') await scenarioStock();
  console.log('\nThe cart rows from this run were left in the database on purpose.');
  console.log('  Look at them:  npm run db:inspect        Start over:  npm run reset');
} catch (e) {
  const codes = [e.code, e.cause?.code, ...(e.cause?.errors || []).map((x) => x.code)].filter(Boolean);
  const detail = codes[0] || e.message;
  if (codes.includes('ECONNREFUSED')) {
    console.error(`\nCould not reach the API at ${BASE}. Is it running? Start it with: npm run dev\n(${detail})`);
  } else if (
    codes.some((c) => ['UND_ERR_SOCKET', 'ECONNRESET', 'EPIPE', 'UND_ERR_CLOSED'].includes(c)) ||
    /other side closed|terminated/i.test(`${e.message} ${e.cause?.message || ''}`)
  ) {
    console.error(
      `\nThe connection to ${BASE} was dropped while requests were in flight. The server most likely crashed.\n` +
        'Look at the terminal running `npm run dev` for an error message, then restart it.\n' +
        '(An error thrown after an `await` in a route that nobody catches stops the whole Node process.)\n' +
        `(${detail})`
    );
  } else {
    console.error(`\nrepro failed: ${e.message}${detail === e.message ? '' : ` (${detail})`}`);
  }
  process.exit(1);
}
