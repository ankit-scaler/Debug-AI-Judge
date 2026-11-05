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
- `?debug=1`/`DebugPanel.jsx` (the reference's Request-log panel): **restored**
  (2026-11-05), reversing the note this replaced. It was originally retired in
  favor of the platform's Terminal tab, Logs tab (Server filter) and Network
  tab (Timeline view), which generalize the same capability to every question
  -- that reasoning still holds for *every other* question, and those tabs
  are still the right first thing to point a learner at. But this question's
  own description still named `?debug=1` (in code formatting, inviting a
  learner to try it), and when the owner actually tried it and found it did
  nothing, they asked for the real thing rather than just a wording fix, after
  being told this reverses the earlier call. `src/debug.js` and
  `src/components/DebugPanel.jsx` are verbatim ports of the reference's own
  files (down to the exact CSS and the `onApiEvent`/`emit` hook in
  `src/api.js`), not a new implementation. One real constraint, stated in the
  description: it only works via "Open in new tab" -- the embedded preview's
  iframe `src` never carries a query string, so there's nothing there for a
  learner to type `?debug=1` into.
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

## Problem statement authored from the real README (2026-11-04)

`question.json`'s `description` field is now the real reference lab's own
`README.md`, adapted and rendered in the left pane (`src/markdown/`, a
hand-rolled markdown subset -- see its own file header for exactly what it
supports). `scenario`/`symptom` are kept as-is alongside it: `app/page.tsx`'s
question-list card still uses `scenario` for its summary, and `description`
is additive, not a replacement of those fields.

Checked against the actual reference repo on disk (not the README text
alone) for anything it points at that this question didn't already have:

- **`docs/img/*.png` (6 screenshots) -- included for real.** Copied to
  `public/questions/flipkart-cart-lab/img/`, referenced from the description
  in the same side-by-side table layout the README itself uses. This was a
  genuine gap, not a deliberate drop.
- **`docs/LAB.md` (the hints file) -- not copied as a file.** Its content
  already exists, differently shaped, as this question's own `hints` array
  and the left pane's progressive "Show next hint" button -- checked
  content-for-content and nothing in `LAB.md` is missing: hint 1 ↔ its
  Hint 1, hint 2 ↔ its Hint 5, hint 3 ↔ its Hints 2/3, hint 4 ↔ its Hint 4,
  hint 5 ↔ its Hint 6. Shipping a second, static copy of the same hints
  would just be a second source of truth that could drift from the real
  one. The description points at the Hints button instead.
- **`database/README.md` (the schema explanation) -- content included, not
  as a separate file.** Folded into the description as "What's in the
  simulated store", written from this question's actual `server-sim/db.js`
  data (7 products, not the real lab's 10; Yoga Mat id 43 stock 5 and
  Dumbbell Set id 49 stock 3 match the real lab exactly). Not a separate
  file because there's no "browse reference docs" surface here outside the
  one description pane -- a `database/README.md`-shaped file sitting in the
  question's file tree would be out of place next to the learner's actual
  editable/readonly code, which is the one thing that tree is for
  everywhere else on this platform.
- **`database/schema.sql`/`seed.sql`/`data/shop.db`, `scripts/repro.js`,
  `scripts/db.js`, `server/`, `client/` -- not applicable or already
  ported.** No real database or server can run in this sandbox at all;
  `server-sim/`, `mock/`, `src/` are the already-built substitutes, and the
  terminal's `repro -- stale/dup/stock`/`db:inspect` commands are already
  the port of `scripts/repro.js`/`scripts/db.js`. Nothing to add.
- The real README's `PRICING_MS`/`JITTER` env-var table (the "bugs vanish
  on a fast laptop" demonstration) is a **deliberate drop**: there are no
  environment variables to set in a browser sandbox, and there's no
  platform-native equivalent to swap it for. The fixed 800/450/100ms delays
  and *why* they're fixed (determinism, not realism) are kept in the
  description, since that's the actual pedagogical point; only the
  "turn it off and watch it vanish" demo itself is dropped.

## Sandbox fix: login now works in the embedded preview (2026-11-04)

The embedded preview iframe's `sandbox` was missing `allow-forms`
(`components/PreviewFrame.tsx`), which silently blocked `Login.jsx`'s form
submission in real Chrome -- confirmed live via two independent input paths
(click and Enter-key), and isolated to the sandbox by testing the identical
code in the unsandboxed "Open in new tab" popup, where it worked. Fixed by
adding `allow-forms` to that one iframe's sandbox list.

This is a correction to the "Known consequence, NOT fixed" note above, not
a duplicate of it -- they are two different limitations:

- **Still true, unrelated to the sandbox fix:** a learner tapping *by hand*
  in the live preview generally won't see Problem 1, because of the
  response-timing difference explained above. `npm run repro -- stale`
  exists specifically to route around this.
- **No longer true, fixed by `allow-forms`:** before this fix, a learner
  could not log in through the embedded preview's UI *at all* -- which also
  meant `npm run repro -- stale` itself could never run there (it requires
  being logged in through the real UI by design) and neither could Hint 1.
  Verified live after the fix: login completes, and
  `npm run repro -- stale` drives the real badge through 0 -> 3 -> 2 -> 1
  with the real `BUG` report, exactly as designed.

**Correction, logged against this note:** "login completes" above was true
but incomplete -- it was verified only as far as the login *request*
succeeding and the header updating, not that anything authenticated
afterward actually worked. It didn't: see the next section. Treat this as
the record of what was actually checked at the time, not as evidence the
full flow worked -- it didn't, until the fix below.

## Second sandbox bug: the auth token never persisted, so everything after login 401'd (2026-11-04)

Found live-testing the full learner flow after the fix above, not during
it: logging in made the header show "Logout (Asha)", but **every
subsequent authenticated call failed with a real 401** -- Add to cart
showed "Something went wrong", the cart page silently showed "Your cart is
empty", and Orders silently showed "No orders yet". All three are the same
root cause, not three bugs.

`src/api.js`'s `getToken()`/`setToken()` stored the token only in
`localStorage`, in a try/catch that silently swallows any throw. The
embedded iframe's sandbox correctly still lacks `allow-same-origin`
(`allow-scripts` + `allow-same-origin` together is a known sandbox-escape
combination, and this iframe runs learner-submitted code -- adding it
would have been the wrong fix). Without it, `localStorage` throws with an
opaque-origin iframe, so `setToken()` silently no-opped and every later
`getToken()` returned `null` -- `AuthContext.jsx`'s `login()` sets React
state (`setUser`) from the login response regardless of whether the token
actually persisted, which is why the header looked logged in while nothing
authenticated afterward worked.

**Fix:** `src/api.js` gained an in-memory `memoryToken` fallback that
`getToken()`/`setToken()` use when `localStorage` throws -- the token
survives for the rest of that preview session (lost on a hard reload, same
as any other React state there), without touching the sandbox attribute at
all. Verified live end-to-end afterward: login, Add to cart, cart page
showing the real line item, checkout, and Order #1 appearing on the Orders
page all work correctly in the embedded preview now.
