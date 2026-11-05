const TOKEN_KEY = 'fk_token';

// The embedded preview iframe is sandboxed without allow-same-origin (and
// that's deliberate -- allow-scripts + allow-same-origin together is a
// known sandbox-escape combination, and this iframe runs learner-submitted
// code). localStorage throws there, so it can't be the only place the token
// lives: this in-memory fallback is what actually keeps a learner logged in
// across every api() call after login() in the embedded preview. It's lost
// on a hard reload, same as any other in-memory React state in this preview
// -- real persistence only happens when localStorage actually works (the
// "Open in new tab" popup, a normal unsandboxed origin).
let memoryToken = null;

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return memoryToken;
  }
};
export const setToken = (t) => {
  memoryToken = t;
  try {
    t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable -- memoryToken above is what actually matters here */
  }
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

// Tiny event hook used only by the ?debug=1 panel (components/DebugPanel.jsx).
const listeners = new Set();
let sentCounter = 0;
export const onApiEvent = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const emit = (e) => listeners.forEach((fn) => fn(e));

// Test-only hook (used by tests/CartContext.test.jsx, and by the
// `npm run repro -- stale` terminal command in mock/handlers.js) to control exactly when
// each response arrives, independent of the mock server's own timing --
// isolating "does CartContext handle out-of-order responses correctly" from
// "is the server itself correct", which are two different bugs (Problems 1
// and 2/3) that should be tested independently of each other.
let fetchOverride = null;
export function __setFetchOverride(fn) {
  fetchOverride = fn;
}

export async function api(method, path, body) {
  const token = getToken();
  const doFetch = fetchOverride || fetch;
  const sentAs = ++sentCounter;
  const startedAt = performance.now();
  emit({ phase: 'sent', sentAs, method, path });
  const res = await doFetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  emit({
    phase: 'done',
    sentAs,
    method,
    path,
    status: res.status,
    ms: Math.round(performance.now() - startedAt),
    version: data.version,
    itemCount: data.itemCount,
    lines: data.items?.length,
  });
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

export const rupees = (paise) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    paise / 100,
  );
