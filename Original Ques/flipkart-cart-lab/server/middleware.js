/** Bearer-token auth backed by the sessions table. */
export function requireAuth(db) {
  return (req, res, next) => {
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const row = token
      ? db
          .prepare(
            'SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?'
          )
          .get(token)
      : null;
    if (!row) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    req.user = row;
    next();
  };
}

/**
 * Express 4 does not catch errors thrown after an `await` in an async route: the promise
 * rejects, nobody handles it, and Node terminates the whole server. Wrap async routes in
 * asyncHandler() so any error is passed to the error handler in app.js (HTTP 500) instead.
 */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Simulates real-world network latency. The handler runs immediately, but the response is
 * held back before it is sent, so responses can arrive in a different order from the
 * order the requests were sent in. Debug headers make this visible in the Network tab.
 *
 * LATENCY=lab    (default) deterministic. Inside a burst of "add to cart" taps the 1st
 *                response is the slowest, the 2nd is faster, the 3rd faster still, so
 *                responses ALWAYS come back in reverse order. Same every run.
 * LATENCY=random the old behaviour: a random 40-450 ms per request.
 * JITTER=off     no artificial latency at all (the automated tests use this).
 */
export function latency({ mode = process.env.LATENCY || 'lab', minMs = 40, maxMs = 450 } = {}) {
  let seq = 0;
  const bursts = new Map(); // per signed-in user: { last, n }
  const BURST_GAP_MS = 1500;

  const labDelay = (req) => {
    const isAdd = req.method === 'POST' && req.path === '/cart/items';
    if (!isAdd) return 120;
    const key = req.get('authorization') || 'anon';
    const now = Date.now();
    const b = bursts.get(key);
    const n = b && now - b.last < BURST_GAP_MS ? b.n + 1 : 0;
    bursts.set(key, { last: now, n });
    return Math.max(80, 800 - 350 * n); // 800, 450, 100, 80, 80 ...
  };

  return (req, res, next) => {
    const mySeq = ++seq;
    const ms =
      mode === 'random' ? Math.round(minMs + Math.random() * (maxMs - minMs)) : labDelay(req);
    const send = res.json.bind(res);
    res.json = (body) => {
      res.set('X-Request-Seq', String(mySeq));
      res.set('X-Debug-Latency-Ms', String(ms));
      setTimeout(() => send(body), ms);
      return res;
    };
    next();
  };
}
