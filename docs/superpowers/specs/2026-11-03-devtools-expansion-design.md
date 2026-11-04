# DevTools Expansion — Logs, Network Timeline, and a Real Terminal

## Context

The learner-facing DevToolsPanel (`components/DevToolsPanel.tsx`) currently has four
tabs: Console, Network, Results, Solution. All of it is driven by one proven pattern:
code running inside the preview iframe calls a local `post(type, payload)` which
`postMessage`s to the host; `PreviewFrame.tsx` demuxes by `type` into typed callbacks;
`SolveScreen.tsx` accumulates arrays; `DevToolsPanel.tsx` renders them as tabs. Console
(`public/preview/frame.html`) and Network (`src/preview/interceptor-source.ts`) both
already use this.

This spec went through two revisions before this one, each from checking it against
reality instead of assumption:

**Revision 1** compared flipkart-cart-lab against the real-world reference lab it was
ported from (`questions/Standard Flipkart Question/flipkart-cart-lab/`) and found: no
way to see the simulated backend's data (the duplicate-row and oversell bugs are only
inferable from the UI, never visible as data), no way to tell client console output
from "server" output, no reliable way to reproduce a timing-sensitive bug on demand
(confirmed live this session: synthetic mouse clicks from the automation tooling were
themselves too unreliable to win the race; invoking the handler directly was what
actually worked), a missing order-history page, and no way to show the reference
author's actual teaching point (`PRICING_MS=0 JITTER=off` makes the bugs vanish —
"that is exactly why bugs like these slip through on a fast laptop"). That revision's
fix was a set of new GUI tabs/controls: Data, Conditions, a Diff tab.

**Revision 2** (this one) corrected a bigger miss in revision 1: the reference README
doesn't just describe bugs, it describes a *workflow* — `npm run dev`, `npm test`,
`npm run repro`, `npm run db:inspect -- "<query>"` — all run from a terminal, by the
learner, as many times as they want, before they're ever sure enough to call it done.
The README's own "Your goal" checklist lists `npm test passes` and `npm run repro
prints clean results` as two of five done-criteria — running these yourself,
iteratively, is the literal definition of done, not optional tooling. Checking the
codebase confirmed the gap is real: `testEntry` is only ever read in
`app/api/attempts/[slug]/submit/route.ts` — there is no client-side test execution at
all. The *only* way a learner finds out if a test passes is hitting Submit, which
round-trips through the server's esbuild+jsdom+vm pipeline and **is** the scored
attempt. (A client-side "Run tests" action was in the *original* plan for this
question, before any of this was built — "bundles+runs the ported test file in the
same iframe for fast, un-scored, iterative feedback" — and silently never got
implemented. Not new scope; unfinished scope.)

That reframes the whole design. A learner debugging a real system doesn't click a
"Run tests" button or open a "Conditions" dropdown — they type `npm test` in a
terminal. So: **the only persistent GUI buttons are Run (build + preview) and Submit
(the scored attempt). Everything else a learner would reach for while debugging —
running the test suite, reproducing a race, inspecting the store, diffing their
changes — happens by typing a command into a real-feeling terminal**, the same way it
would on their own machine. This supersedes revision 1's Conditions dropdown, Data
tab, and Diff tab — each becomes a terminal command instead of a GUI control. Logs and
Network stay as passive tabs (a real engineer keeps DevTools open beside their
terminal too, not instead of it).

A product-detail page (`ProductPage.jsx` in the reference) remains a deliberate drop,
not a gap — recorded in flipkart-cart-lab's `notes/author-notes.md` per the authoring
standard (`docs/question-authoring-standard.md`).

## Goals

- The only GUI buttons for taking action are Run and Submit. Every debugging action
  (run the tests, reproduce a race, inspect the store, diff changes) is a typed
  terminal command, matching how a learner would actually work on their own machine.
- `npm test` is real: it bundles and runs the actual test file, client-side, fast,
  as many times as the learner wants, with zero effect on scoring — not a preview of
  Submit, a genuinely separate, cheap, repeatable action.
- Client and server output are visibly separate in Logs, filterable from one place.
- A timing-sensitive bug is reproducible on demand via a terminal command, not
  dependent on manual click speed.
- None of this is mandatory per-question. A question with no simulated backend (every
  existing LLM-graded question today) renders exactly as it does now — the terminal
  only offers commands a question actually declares, platform-native commands
  (`npm run dev`, `npm test` when `gradingMode: 'tests'`, `git diff`) excepted.

## Non-goals (deferred, not building now)

- Error/exception tracker (Sentry-style grouping) — Logs already surfaces thrown
  errors; grouping is a refinement, not a gap.
- Storage/session inspector (localStorage/cookies) — no current question's bug class
  needs it.
- Live threshold alerts during Run — the terminal's `npm run db:inspect`-equivalent
  already makes state inspectable on demand; a separate alerting system isn't
  justified yet.
- Incident notes pad — purely a convenience, no debugging-capability gap.
- Multi-service simulation, distributed tracing — a different, much larger project.
- Command history (up-arrow), tab-completion — real terminal conveniences, but add
  meaningfully to the terminal component's complexity for no debugging-capability
  gain; a learner retypes or copy-pastes a command, same as this platform already
  expects for everything else.
- **An LLM-authored summary of Submit's real results** — floated in discussion as
  "the only use of AI" on Submit (explaining real `executeTests()` output in plain
  language, never replacing it as the source of truth). Explicitly **not** speced or
  built here: the user's own standing rule requires, before any LLM is added to a
  product flow, agreeing what "correct output" means, a reviewed golden dataset, a
  named eval metric, and an eval harness run before it ships — none of which this
  spec does. If wanted, that's a separate, small follow-up that starts with that
  process, not with code.

## Architecture

### Layout change

```
Code | Preview

[Run] [Reset] [Submit]                    <- the only two action buttons (Reset
                                              reverts edited files, unchanged)

Logs (Client|Server filter) | Network | Terminal | Results | Solution
                                           <- bottom panel: Terminal replaces the
                                              Conditions dropdown / Data tab / Diff
                                              tab from the previous revision
```

Console is renamed **Logs** and gains a Client/Server filter (two underlying arrays,
one merged chronological view, filter chips above the list). Network gains a
Table/Timeline toggle. Terminal is new. Solution and Results are unchanged.
`BottomTab` becomes `'logs' | 'network' | 'terminal' | 'results' | 'solution'`.

### The Terminal

A new `components/TerminalPanel.tsx`: a scrollback output area plus a single text
input, monospace, styled like a real shell (`$ ` prompt). A learner types a command,
presses enter, sees real output appended — no buttons, no dropdown.

Commands split into two kinds:

**Platform-native** — always available, need no per-question authoring, because the
machinery already exists generically:
- `npm run dev` — identical to clicking Run (same `runToken` bump); typing it is just
  another way to trigger the same action.
- `npm test` — available whenever `loaded.meta.gradingMode === 'tests'` and
  `testEntry` is set. The genuinely new piece (see below): bundles and runs the real
  test file *client-side*, in the iframe, fast, unscored.
- `git diff` — a hand-rolled line-level diff between the current editor content and
  the original broken files (not the solution). Pure host-side computation —
  `SolveScreen.tsx` already holds both. No new dependency: a hand-rolled diff is
  enough for files that are at most a few hundred lines, flagged here since adding an
  actual diff library would need separate sign-off first.
- An unrecognized command prints a realistic `command not found: <cmd>` line, the
  same way a real shell would, rather than silently doing nothing.

**Question-defined** — a question opts in via `question.json`, the same split as the
previous revision's Conditions design used (server never executes question files, so
metadata has to be declarative):

```json
"terminalCommands": [
  { "id": "repro-stale", "command": "npm run repro -- stale", "help": "reproduce the stale-badge race (problem 1)" },
  { "id": "repro-dup", "command": "npm run repro -- dup", "help": "reproduce the duplicate cart rows (problem 2)" },
  { "id": "repro-stock", "command": "npm run repro -- stock", "help": "reproduce overselling the Dumbbell Set (problem 3)" },
  { "id": "db-inspect", "command": "npm run db:inspect", "help": "print the current cart_items / products tables" }
]
```

`QuestionMeta`/`LearnerQuestion` gain `terminalCommands?: { id, command, help }[]`,
loaded and forwarded exactly like `hints` already is. `mock/handlers.js` supplies the
implementations, keyed by id:

```js
export const terminalHandlers = {
  'repro-dup': async () => {
    // Same technique as the previous revision's Conditions design: calls the real
    // handler directly inside the iframe realm, not synthetic pointer events --
    // strictly more reliable than simulating mouse input (confirmed empirically
    // this session). Returns a formatted report, matching the reference README's
    // own repro output shape (arrival order, cart version, item/line counts).
    const results = [];
    for (let i = 1; i <= 3; i++) {
      const r = await window.__debuglab_addToCart__('yoga-mat-43');
      results.push(r);
    }
    return formatReproReport(results);
  },
  'db-inspect': () => formatTable('cart_items', store.cartItems),
};
```

The host sends `{ type: 'terminal-run', payload: { id, args } }`; `devtools-source.ts`
looks `id` up in `terminalHandlers`, calls it (await-ing if it returns a promise),
and posts back `{ type: 'terminal-output', payload: { id, ok, text } }`. An id with no
matching handler (an authoring mistake, or a stale message from a previous bundle
generation) acks `ok: false` with a generic message — never a thrown error.

### `npm test`: the one genuinely new execution path

This is not a `terminalHandlers` lookup — it needs a build step. The host bundles the
question's `testEntry` + the shared harness (`src/testing/browser-test-harness.ts`) +
the interceptor, the same file set `src/grading/execute-tests.ts` already bundles for
the server-side Submit path, but through `esbuild-wasm` client-side (the same tool
`src/preview/bundler.ts`'s `bundlePreview` already uses for Run) instead of real
`esbuild` + `node:vm`. The bundled code is sent into the *same already-running*
iframe — reusing the live app's DOM and React tree is the point: a real `npm test`
run exercises the real page a learner is already looking at.

New host->iframe message `{ type: 'run-tests', payload: { code } }` (parallel to the
existing `run` message's `{ code, css }`); new iframe->host messages
`{ type: 'test-results', payload: { tests: TestResult[] } }` and
`{ type: 'test-build-failed', payload: { errors } }`. The terminal renders the
results as PASS/FAIL lines with real assertion messages — the same rendering
`ResultCard`'s `tests_ran` branch already does for Submit, reused here, not
reimplemented.

**This never touches scoring.** `npm test`'s results live only in the terminal's
scrollback. Submit is unchanged: it still calls the real server-side `executeTests()`
exactly as it does today, independently bundled and independently executed, and that
remains the only result that can set `scored: true`. A learner can run `npm test`
fifty times while iterating and it has zero effect on `firstPass`/`gaveUp` state.

### `devtools-source.ts`

Sibling to `interceptor-source.ts`, same shape (a template-string module compiled
into the learner's bundle). Simpler than the previous revision's version — now that
`db:inspect` is a question-authored `terminalHandlers` entry with direct access to
`store` (no separate snapshot-push mechanism needed), the shared module only needs
one export:

```js
// import { serverLog } from './__devtools__';
export function serverLog(level, ...args) {
  post('server-log', { level, text: args.map(format).join(' ') });
}
```

Plus the `terminal-run` listener described above. `format`/`post` are copied from the
same pattern already in `frame.html` / `interceptor-source.ts`. Platform-provided,
readonly — never part of a question's editable `files/`.

### Message types (new or changed)

| Type | Direction | Payload | Purpose |
|---|---|---|---|
| `server-log` | iframe -> host | `{ level, text }` | Logs tab, "Server" side |
| `terminal-run` | host -> iframe | `{ id, args }` | Terminal invokes a question-defined command |
| `terminal-output` | iframe -> host | `{ id, ok, text }` | Terminal command's result |
| `run-tests` | host -> iframe | `{ code }` | `npm test`: bundled test code to execute in the live iframe |
| `test-results` | iframe -> host | `{ tests: TestResult[] }` | `npm test` real results |
| `test-build-failed` | iframe -> host | `{ errors }` | `npm test` bundling failed (shown as terminal output, like a real failed `npm test` build) |
| `network` (changed) | iframe -> host | adds `startedAt: number` | Needed to place requests on the Network tab's Timeline axis; `durationMs` alone can't be plotted against taps |

`network`'s `startedAt` is free: `src/preview/interceptor-source.ts` already computes
`const startedAt = Date.now()` before calling the handler; it's just never included in
the posted payload today (`src/preview/interceptor-source.ts:44,73-81`).

## Data flow

1. Terminal input is parsed host-side against: the platform-native command list, then
   the question's `terminalCommands` metadata (already in `LearnerQuestion`, loaded
   like `hints`). No match -> print "command not found" and stop.
2. `npm run dev` / `git diff` resolve entirely host-side (no iframe round trip).
3. A question-defined command sends `terminal-run`; `devtools-source.ts` inside the
   bundle calls the matching `terminalHandlers[id]`, posts `terminal-output` back.
4. `npm test` triggers a *separate bundle* (test entry + harness + interceptor, via
   `esbuild-wasm`) sent as `run-tests` into the *existing* iframe (not a fresh
   `runToken` generation — the app stays mounted); the iframe executes it and posts
   `test-results` or `test-build-failed`.
5. `PreviewFrame.tsx`'s existing `onMessage` switch gains the new cases; `network`
   gains `startedAt`.
6. `SolveScreen.tsx` gains terminal scrollback state and the two send methods
   (`sendTerminalCommand`, `sendRunTests`), mirroring how `runToken`/`send` already
   post into the iframe via `PreviewFrame`'s imperative handle.
7. `DevToolsPanel.tsx` takes the new props and renders the Terminal tab;
   `BottomTab`'s `'console'`/`'data'` give way to `'logs'`/`'terminal'`.

## Error handling

- A `terminalHandlers[id]` throwing is caught inside `devtools-source.ts` before
  posting `terminal-output`; `ok: false` with the error text as `text`, printed in the
  terminal like a real command's stderr — never the preview's crash banner, which
  would otherwise fire for an error that was actually just a bad command handler.
- `npm test`'s bundle failing to compile (a syntax error in the learner's edited code,
  reachable from `testEntry`) prints like a real failed `npm test` invocation would:
  the build errors, not a stack trace from the bundler itself.
- A `terminal-run` for an id the question doesn't define acks `ok: false` with a
  generic message, not a thrown error — can legitimately happen from a stale message
  after a Reset/new bundle generation.
- `npm test` started while a previous `npm test` is still running: the terminal
  disables input until the current command resolves (same "one bundle at a time"
  discipline `ReadyGate` already enforces for Run), rather than letting two test runs
  race inside the same iframe.

## Testing

- `src/preview/devtools-source.test.ts`: `serverLog` posts the right shape; a
  `terminalHandlers` entry that throws still produces `terminal-output` with
  `ok: false`; an unknown id acks `ok: false`.
- `components/TerminalPanel.test.tsx` (new, or "manually verified in browser" if no
  component-test setup exists in this repo — flagged explicitly either way): an
  unrecognized command prints "command not found"; a recognized command's output
  appends to scrollback; input is disabled while a command is pending.
- A small hand-rolled-diff unit test (for `git diff`): identical files produce no
  diff lines; an added line, a removed line, and a changed line each render
  correctly.
- `npm test`'s client-side bundling, tested the same way `execute-tests.ts`'s
  server-side bundling already is: a passing test reports passed; a failing test
  reports the real assertion message; a syntax error in reachable code reports as a
  build failure, not a crash.
- flipkart-cart-lab retrofit, verified live in the browser (this codebase's
  established method for anything preview-iframe-shaped — esbuild-wasm/jsdom
  integration work has consistently needed real execution, not just unit tests, to
  catch real bugs): `npm test` in the terminal runs the real 12-test suite against
  unfixed code and shows 6 failing, matching the reference README's documented
  pattern, with zero effect on Submit's own scoring; `npm run repro -- dup`
  reproduces the duplicate-row bug without any manual clicking; `npm run db:inspect`
  prints the duplicate Yoga Mat rows as data; `git diff` shows exactly the files
  touched; placing a real order shows up under order history.

## Rollout

1. Build the platform plumbing (new message types, `devtools-source.ts`,
   `TerminalPanel.tsx`, `DevToolsPanel.tsx` layout change) behind "a command is only
   offered if the question declares it (or it's platform-native)" — no existing
   question's rendering changes.
2. Build `npm test`'s client-side bundle-and-run path (new, the largest single piece
   of this plan): reuses `bundlePreview`'s `esbuild-wasm` setup and
   `execute-tests.ts`'s file-assembly logic (test entry + harness + interceptor), new
   `run-tests`/`test-results`/`test-build-failed` messages, terminal rendering reusing
   `ResultCard`'s existing `tests_ran` line format.
3. Retrofit flipkart-cart-lab as the first (and for now, only) consumer: add
   `terminalCommands` to `question.json` and matching `terminalHandlers` to
   `mock/handlers.js` for the three `npm run repro -- <scenario>` variants and
   `npm run db:inspect`; wire `serverLog` calls into `server-sim/cartHandlers.js`.
4. Close the two content gaps found in revision 1, since they touch the same files:
   add `GET /api/orders` to `mock/handlers.js`, port `Orders.jsx` from the reference,
   add the gated `{user && <Orders link>}` nav entry to `Header.jsx`, wire the page
   into `App.jsx`'s routing. Record `ProductPage.jsx` as a deliberate drop in
   `notes/author-notes.md`.
5. Retire `questions/flipkart-cart-lab/files/src/components/DebugPanel.jsx` and the
   `?debug=1` flag (`App.jsx`'s `useDebugFlag`/`DEBUG_KEY`); rewrite hint #1 in
   `question.json` to point at the terminal instead of a URL flag.
6. No other existing question changes — they have no `server-sim`/`testEntry` layer,
   so the terminal offers them only the platform-native commands that still apply
   (`npm run dev`, `git diff`; no `npm test` without `gradingMode: 'tests'`).

## Global Constraints

- No new runtime dependency without explicit sign-off (`git diff` is hand-rolled for
  this reason).
- A command is only offered if it's platform-native or the question declares it —
  existing questions' rendering must not change at all.
- `devtools-source.ts` is platform-provided and readonly, never part of a question's
  editable `files/`, matching `interceptor-source.ts`'s existing status.
- `npm test` must never affect `scored`/`firstPass`/`gaveUp` state — only Submit's
  independent server-side `executeTests()` call can.
- A `terminalHandlers[id]` throwing, or a `npm test` bundle failing, must degrade to
  realistic terminal output, never crash the whole preview.
- No LLM call is added to the Submit path without first going through the standing
  mandatory process for adding an LLM to a product flow (see Non-goals).

## Review Focus

- A question's `terminalHandlers[id]` that touches DOM nodes which don't exist yet
  (the command fires before the app has rendered) — what does the terminal show, and
  does it corrupt state for a later, valid command?
- Typing `npm test` twice in quick succession (before the first finishes) — confirmed
  the terminal must serialize these, not let two bundles/executions race inside one
  iframe.
- `npm test` run immediately after an edit that hasn't been "Run" yet — does the test
  bundle see the learner's latest edited code, or a stale previous generation? (It
  must bundle fresh from current editor content each time, independent of whether
  Run has been clicked.)
- A learner switching the Logs tab's filter mid-stream (new lines still arriving) —
  does the filter apply to history and new arrivals consistently?
- `git diff` on a file with trailing-whitespace-only or line-ending-only changes —
  does the hand-rolled diff produce a wall of noise that drowns the real change?
- Terminal scrollback after Reset (which reloads the iframe to a fresh generation) —
  does old output linger in a way that looks like it came from the current code, the
  same class of bug `ReadyGate`/`runToken` already exists to prevent for Network?
