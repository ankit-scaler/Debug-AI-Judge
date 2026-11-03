const TOKEN_KEY = 'fk_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t) => {
  try {
    t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

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
  const res = await doFetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

export const rupees = (paise) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    paise / 100,
  );
