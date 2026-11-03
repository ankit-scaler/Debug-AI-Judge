# Author notes (hidden from learners)

Ported from a real standalone lab (React + Express + SQLite), simulated
entirely client-side for this platform -- see `server-sim/` and
`mock/handlers.js`. Three real bugs, each in a different file:

## Problem 1 -- stale response race (`src/context/CartContext.jsx`)

`mutate()` calls `setCart(next)` unconditionally for whatever response
arrives, with no way to tell a stale response (an earlier request that took
longer) from the latest one. Three rapid taps resolve out of order
(`server-sim/pricing.js`'s fixed 800/450/100ms burst delays guarantee this
deterministically); whichever happens to arrive *last* wins, correct or not.

**Fix**: tag each mutation with a request id (a ref that increments per
call); after awaiting, only apply the response if the id still matches the
latest one issued.

## Problem 2 -- duplicate cart rows (`server-sim/cartHandlers.js` + `server-sim/db.js`)

Two parts, two files:

1. `postItems` reads `existing` (does this cart already have a row for this
   product?) *before* `await pricing.quote(productId)`, then reads its
   `.quantity` from that same pre-await snapshot to compute `nextQty`.
   Concurrent requests for a *new* product all see `existing: undefined` and
   each INSERT a separate row. Concurrent requests for an *already-existing*
   row all compute `nextQty` from the same stale snapshot and the last write
   wins, losing the others' increments.
2. Independently, `server-sim/db.js`'s `insertCartItemDirect` enforces no
   uniqueness at all -- mirrors the real schema having no
   `UNIQUE(cart_id, product_id)` constraint. `tests/cart.test.js`'s "the
   database itself rejects duplicate lines" test checks this file
   specifically, bypassing the route entirely -- fixing only
   `cartHandlers.js` does not make it pass.

**Fix**: in `cartHandlers.js`, move the `existing` read to *after* the
`await` (nothing else can run between that read and the write in this
single-threaded simulation, so this is the real transaction boundary). In
`db.js`, make `insertCartItemDirect` throw on a duplicate `(cartId,
productId)` pair, the same defense-in-depth the real schema constraint adds.

## Problem 3 -- overselling (`server-sim/cartHandlers.js`)

Same root cause as Problem 2 part 1: the stock check
(`nextQty > product.stock`) uses the same pre-await, potentially-stale
`existingQtyAtReadTime`, so concurrent requests can all pass a check that
would fail if any of them saw the others' writes. The Problem 2 fix (move
the read after the await) fixes this too -- it is the same bug wearing two
different symptoms, exactly like the real lab.

## Grading

`gradingMode: "tests"` -- this question is NOT graded by the LLM rubric
judge. Submit bundles `tests/all.test.js` (which imports the other four
test files for their side effects) together with the submission and runs it
server-side in a real `node:vm`, via `src/grading/execute-tests.ts`. Real
PASS/FAIL, real assertion messages -- see the Results panel's log-style
output in ResultCard.tsx. On the untouched code, exactly 6 of 12 tests fail
(three cart.test.js tests tied to Problems 2/3, the duplicate-rejection
test, the checkout knock-on test, and the client race test) -- the same
split the real lab's own README documents.

## Platform fidelity notes (2026-11-03 retrofit)

- `ProductPage.jsx` from the reference lab is a deliberate drop, not a gap: the
  catalog's own Add-to-cart already exercises every bug class this question
  teaches (races/duplicates/oversell), and a detail page adds surface area with
  no pedagogical return.
- `?debug=1`/`DebugPanel.jsx` (the reference's Request-log panel) is retired in
  favor of the platform's Terminal tab, Logs tab (Server filter) and Network
  tab (Timeline view), which generalize the same capability to every question.
- `npm run repro -- dup|stock` send real fetch() requests through the same
  interceptor the app uses (so they show in Network and Logs), 60ms apart, and
  report responses in true arrival order -- a port of the reference's
  scripts/repro.js.
- `npm run repro -- stale` cannot be a server-side burst here: in this
  simulation the pricing delay sits before the write, so responses always reach
  the client in the order the server produced them, and a plain burst never
  shows Problem 1 (the reference delays the RESPONSE instead, via its
  LATENCY=lab middleware). The command therefore drives the real app (clicks the
  real button, watches the real badge) and uses api.js's `__setFetchOverride`
  to hand responses back newest-first -- the same network condition the
  reference simulates and that tests/CartContext.test.jsx uses.
- Known consequence of the same difference, NOT fixed by this retrofit: a
  learner tapping by hand in the live preview will generally not see Problem 1
  at all, and with only the reference CartContext fix (last-SENT request wins)
  a hand-tapped burst can settle on the oldest snapshot, because the server's
  completion order is the reverse of send order. Fixing that means moving the
  simulated latency from pricing.js to the response (like the reference) and
  re-validating the whole test suite -- a separate change.
