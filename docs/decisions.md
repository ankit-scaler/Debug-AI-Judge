# Decisions log

## 2026-10-27 — PRD review round (Debugging Lab P1)

Source PRD: Google Doc "Debugging Lab: PRD (P1 Frontend/Full-stack)", Oct 27 2026.
This log records amendments agreed during the review of that PRD. Where a decision
went against the recommendation, that is noted explicitly.

### D1. P1 scope cut to React + mock API
- **Decision:** PGlite / in-browser SQL questions and the embedded React DevTools
  panel move to P2. P1 ships React frontend bugs plus mocked-API bugs only.
- **Reason:** SQL questions are effectively a second product (own authoring flow,
  own console, own test shape) and the Postgres WASM download contradicts the
  PRD's own "low-end laptops lag" risk. React DevTools needs `react-devtools-inline`
  wiring and duplicates right-click Inspect, which the learner flow already uses.
- **Rejected:** keep SQL in P1; keep everything as written; cut the mock API too
  (would have dropped the Network panel and all API-shape bug categories).

### D2. Authoring stays ZIP upload
- **Decision:** authors upload a ZIP with a `debuglab.json` manifest, as the PRD
  specifies.
- **Reason:** user's call, for flexibility in what a question's app can be.
- **Recommendation was against this** — a pinned React template with a fixed dep
  set guarantees every question builds and makes the 30-questions-in-8-weeks
  target more plausible. Decision stands; mitigations below are therefore required,
  not optional.
- **Consequences accepted:** P1 must own manifest validation, a dependency
  allowlist resolvable by the bundler, and a mandatory build-and-run check at
  upload time (not only at the step-5 validation gate) so authors see failures
  immediately.
- **Rejected:** pinned template; template with ZIP escape hatch; fork-an-existing-question.

### D3. Pass/fail is decided server-side by an LLM, not by a test runner
- **Decision:** on submit, the server sends the learner's code to a model and
  records the returned verdict. The browser never computes a score.
- **Reason:** user's call. Avoids hosting a sandboxed test-runner container.
- **Recommendation was against this.** Costed alternatives at the time of the
  decision: a container on Fly.io/Cloud Run at ~$5-10/mo, deterministic, ~2-5s
  per submit; versus LLM grading at ~$0.04/submit on an Opus-tier model
  (~$1,000 at 25K submits) or ~$0.0015 on a Haiku-tier model (~$38).
- **Tradeoffs being carried:** verdicts are non-deterministic, and the grader has
  a prompt-injection surface that a test runner does not (learner code can contain
  instruction-shaped comments).
- **Wins from this choice:** score forgery is closed (the client cannot POST its
  own result, which the PRD's original design permitted), and the in-browser
  Sandpack test-runner spike disappears.
- **Required mitigations, all in scope for P1:**
  1. Verdict cache keyed on hash of (submitted files + question version), so
     identical code always yields an identical verdict and repeat submits are free.
  2. Grade against author-written criteria, not an open-ended correctness question.
     Hidden tests become a rubric; the grader returns structured JSON with
     per-criterion pass/fail plus a quoted line of evidence.
  3. The reference fix is included in the prompt as the anchor for comparison.
  4. Deterministic build check runs first; a build failure fails free, no tokens spent.
  5. Learner code is delimited as data, with the grader instructed that it is never
     an instruction; verdicts come back as structured output.
  6. Monthly spend ceiling with a hard cutoff, plus a per-learner daily graded-submit cap.
- **Rejected:** container runner; Vercel serverless runner; local Docker then decide.

### D4. Model calls go through OpenRouter
- **Decision:** OpenRouter, not the Anthropic API directly.
- **Reason:** user's call (procurement — existing OpenRouter budget).
- **Consequences:** no official Anthropic SDK (OpenRouter is an OpenAI-compatible
  endpoint); prompt-caching behaviour through the proxy must be verified against
  OpenRouter's live docs before client code is written, since each question's code
  and rubric repeat on every submit and caching is the main cost lever.
- **Rejected:** Anthropic API direct; dual-provider switchable; provider-agnostic layer.

### D5. AI spend ceiling is set after the eval
- **Decision:** build the grader eval first, measure accuracy and cost per graded
  submit across model tiers on real questions, then set the monthly ceiling from
  measured numbers.
- **Reason:** the grader now decides points and leaderboard position, so its
  accuracy is a launch blocker and model choice should follow measurement.
- **Constraint:** the ceiling must exist before learners get access.
- **Rejected:** ~$300/mo; ~$100/mo; ~$25/mo set upfront.

### D6. Cost centre for admin
- **Decision:** log one `ai_usage` row per model call — user, question, feature
  (`draft` / `qa` / `feedback` / `grade`), model, input/output/cached tokens, cost,
  latency, prompt version. Admin page shows spend by feature and by author, with a
  monthly ceiling and hard cutoff.
- **Reason:** requested by user; per-question attribution cannot come from a
  provider billing console.

### D7. Mock API uses an injected fetch/XHR interceptor, not MSW
- **Decision:** a module injected into every sandbox patches `fetch` and
  `XMLHttpRequest` and matches against the question's handler table. Authors write
  handlers in an MSW-shaped API so the familiar form is kept.
- **Reason:** MSW in the browser needs a service worker registered at the preview
  iframe's scope, and that iframe is served from the bundler's origin. The
  interceptor also feeds the Network panel for free, since we own every request.
- **Rejected:** MSW as the PRD specifies.
- Reversible, affects no data.

### D8. OpenRouter usage shape (verified 2026-10-27)
- **Decision:** pin exact model IDs (`anthropic/claude-opus-5.5`,
  `anthropic/claude-haiku-5.5`), never the `~anthropic/claude-opus-latest` alias;
  order the grader prompt stable-prefix-first with an explicit `cache_control`
  breakpoint after the rubric and reference fix; set `require_parameters: true`
  alongside `response_format` so requests only route to endpoints that honour the
  JSON schema; validate every verdict against the schema server-side.
- **Reason:** verified facts — no inference markup (5.5% applies to credit
  purchases only), cache reads at 0.1x with a 512-token minimum prefix, and
  structured-output support that is per-endpoint and whose strict mode is not
  guaranteed across providers.
- **Consequence:** a malformed verdict is a system error, never a fail for the
  learner. A moving model alias would invalidate the eval, hence the pin.
- **Corrected estimate:** ~$0.017/graded submit on Opus 5.5 or ~$0.0004 on
  Haiku 5.5 with caching, i.e. roughly $50/mo or $1.50/mo at a 5,000-submit pilot.
  This supersedes the ~$200/mo figure quoted during the review session.

### D9. Grader model pinned to Sonnet 4.6
- **Decision:** `anthropic/claude-sonnet-4.6` on OpenRouter, pinned by exact ID.
  No moving aliases.
- **Reason:** user's instruction.
- **Noted at the time:** Sonnet 4.6 is $3/$15 per MTok against Sonnet 5.5 at
  $2/$10 — the newer model is ~33% cheaper. The choice was made anyway and stands;
  recorded here so nobody later reads the price as an oversight.
- **Consequences:**
  - Minimum cacheable prefix is 1,024 tokens on Sonnet 4.6, not the 512 that
    Sonnet 5.5 / Opus 5.5 / Haiku 5.5 get. The grader's stable prefix (~2K) clears
    it, but questions with terse rubrics could silently fall under and stop
    caching — the eval records cache-hit rate per question and flags any prefix
    under ~1,200 tokens.
  - Revised cost: ~$0.013 per graded submit with caching, ~$38/month at a
    5,000-submit pilot, plus the 5.5% credit fee.
  - Haiku 5.5 remains the model for learner feedback; the eval decides whether it
    is also adequate for grading.

### D10. OpenRouter token accounting and cost source (measured 2026-10-27)
- **Decision:** record the provider's own cost figure
  (`cost_details.upstream_inference_cost`, falling back to `usage.cost`) as the
  authoritative spend, and keep the local price table as a cross-check that warns
  on a divergence above 25%. Price cache writes at 1.25x and cache reads at 0.1x.
  Treat `cached_tokens` and `cache_write_tokens` as subsets of `prompt_tokens`.
- **Reason:** measured, not assumed. Two identical calls over a ~5.5K-token cached
  prefix returned write cost $0.02070 and read cost $0.00168, both of which
  reproduce exactly from list price at those multipliers, and `cached_tokens`
  (5511) came back below `prompt_tokens` (5521).
- **Also found:** this account is BYOK (`is_byok: true`, `usage.cost: 0`), so the
  5.5% credit-purchase fee does not apply — Anthropic list price is paid directly,
  with OpenRouter taking 5% of list only above $25,000/month. Pilot cost estimates
  in D8/D9 are therefore slightly conservative.
- **Consequence:** a price-table drift becomes a visible warning on the usage row
  instead of a wrong cost centre. `costUsd` no longer throws on an impossible
  usage shape — it clamps and flags, because that code runs with a learner waiting.
- **Cost of the measurement:** about $0.02, with the user's explicit approval.

### D11. Preview runs on esbuild-wasm in the browser, not Sandpack
- **Decision:** the live preview bundles the learner's files with `esbuild-wasm`
  in the browser and runs the result as a blob module inside an iframe, with React
  vendored locally and resolved through an import map. Sandpack is not used.
- **Reason:** `esbuild-wasm@0.28.2` is the exact WASM twin of the `esbuild@0.28.2`
  already running the server-side build gate, so one resolver
  (`src/bundling/resolve.ts`) serves both and a submission cannot preview fine but
  fail the gate. It also removes the PRD's own flagged risk — "public CodeSandbox
  bundler rate limits at 5,000 learners" — and works offline after first load.
- **Departs from the PRD**, which specified Sandpack. User's call, taken in
  planning with the tradeoff stated.
- **Costs:** ~150 lines of bundling glue we own; "hot reload" is re-bundle and
  reload rather than true HMR; a 3.6 MB gzipped `esbuild.wasm` on first load,
  cached thereafter. That download is worth watching against the PRD's low-end
  laptop concern.
- **Rejected:** Sandpack as specified; Sandpack now with esbuild as a fallback.

### D12. Phase 2a is a vertical slice
- **Decision:** one question, no login, no database, no timer/hints/score/
  leaderboard. In-memory verdict cache, spend ledger and first-pass claims
  (`src/server/local-deps.ts`).
- **Reason:** the unproven piece was the browser runtime, not the UI. Proving it
  before building anything on top keeps a failure cheap.
- **Consequence:** `localhost` only. Phase 2b adds Supabase and the rest.

### D13. esbuild-wasm is called directly, with no hand-written worker
- **Decision:** no `bundler.worker.ts`. `esbuild.initialize()` spawns its own
  internal worker, so compilation is already off the main thread.
- **Reason:** the plan called for our own web worker, which would have meant
  bundler-specific worker plumbing under Turbopack — the single largest risk in
  the plan. esbuild-wasm makes it unnecessary.
- **Cost if wrong:** none observed; plugins run on the main thread either way.

### D14. Relative TypeScript imports carry no file extension
- **Decision:** relative imports across `src/` and `evals/` are extensionless
  (`'../types'`, not `'../types.js'`).
- **Reason:** Turbopack does not resolve a `.js` specifier to a `.ts` file, so
  every App Router import of the grading engine failed. tsx, vitest and tsc all
  resolve extensionless fine.
- **Cost if wrong:** running these modules under plain `node
  --experimental-strip-types` would need the extensions back. We use tsx (D-note
  in the Task 12 ruling), so this does not bite.

### D15. dompurify pinned by npm override
- **Decision:** `overrides: { dompurify: "3.4.17" }` in package.json.
- **Reason:** monaco-editor 0.56.0 and 0.57.0 both resolve dompurify 3.4.8, which
  carries a critical advisory (affects <=3.4.16); npm's own advice was circular
  between the two monaco versions. 3.4.17 is the patched release.
- **Result:** `npm audit` reports 0 vulnerabilities.

### D16. esbuild-wasm init guard moved to globalThis, with a catch-and-ignore fallback
- **Decision:** `src/preview/bundler.ts` parks the `esbuild.initialize()` promise
  on `globalThis` instead of a module-level `let`, and treats a caught
  `"more than once"` rejection as success rather than a failure.
- **Reason:** reproduced live. Every edit to `bundler.ts` during development
  triggers Turbopack HMR, which re-evaluates the module and resets a plain local
  variable to `null`. The real `esbuild-wasm` instance (in `node_modules`, never
  hot-reloaded) still remembers it already initialised, so the reset guard made a
  second real call and the library's own idempotency check threw
  `Cannot call "initialize" more than once` — caught live via Next's dev-server
  terminal reporting of unhandled browser rejections, then reproduced directly
  against the real library in a throwaway Node script (confirmed the exact
  message, and confirmed the library stays fully usable after the error is
  caught and ignored).
- **Likely also explains** the earlier "Cannot resolve ./CartContext.jsx from
  mock/handlers.js" report: a half-initialised bundler state from the same
  mechanism, on a tab that had been open across many prior HMR cycles.
- **Verified:** `src/preview/bundler.test.ts` simulates the HMR reset with
  `vi.resetModules()` + re-import, asserting `initialize()` is called once
  across two fresh module instances, that a caught stray rejection does not fail
  the bundle, and that a genuine failure is not cached (so a retry can succeed).
- **Judgment call, not asked about first:** added `app/api/debug/log/route.ts`,
  a local-only POST sink the bundler now reports to on every bundle and on every
  unresolved import, since this session has no browser automation tool and
  needed a way to see what the browser actually held. Scoped to development
  only, not linked from anywhere a learner reaches. Flagged for removal if it
  is not wanted as standing infrastructure.

### D17. Preview frame injects an inline module script, not blob + dynamic import
- **Decision:** `public/preview/frame.html` runs the learner's bundled code via
  an inline `<script type="module">` with `textContent` set to the code,
  appended to the document. The previous approach — `URL.createObjectURL(blob)`
  then `import(blobUrl)` — is removed.
- **Reason:** the iframe is deliberately sandboxed with an opaque origin
  (`sandbox="allow-scripts allow-modals"`, no `allow-same-origin`, so it cannot
  reach the parent page). Reported error: `TypeError: Failed to fetch
  dynamically imported module: blob:null/<uuid>` — the `null` confirms the blob
  URL carries the document's opaque origin. Dynamic `import()` of a `blob:` URL
  from an opaque-origin document is unreliable in Chromium. An inline module
  script has no fetch step for its own top-level text, sidestepping it.
- **Companion fix, same root cause:** an opaque origin is never same-origin
  with a real host, so the iframe's *other* fetches — the import map resolving
  `react`/`react-dom/client` to `/preview/vendor/*.js` — were also subject to
  CORS and had no allow header. `next.config.ts` now sends
  `Access-Control-Allow-Origin: *` on `/preview/:path*` (required) and
  `/monaco/:path*` (precautionary — Monaco loads from the parent page, which
  has a normal origin, so this one is not required by this specific bug, but
  costs nothing on public, non-secret static files).
- **Not verified in a live browser.** This session has no browser automation
  tool (checked: no Chrome extension, no built-in browser pane, no
  computer-use). The diagnosis rests on the error string's `blob:null` origin
  marker, documented Chromium behaviour around opaque-origin module fetches,
  and the HTML/Fetch spec rule that an opaque origin is never same-origin with
  a tuple origin. Confirmed server-side: the CORS header is present on both
  paths, the old blob/import code is gone from the served HTML, the inline
  script injection is present. Needs a real browser to confirm the fix lands.

### D18. The preview iframe is keyed by runToken
- **Decision:** `components/PreviewFrame.tsx`'s `<iframe>` now has `key={runToken}`,
  and `frameReady` resets to `false` synchronously at the top of the build
  effect whenever `runToken` changes.
- **Reason:** after D17's fix, the same `blob:null` error kept appearing with
  fresh random IDs on every Run click. The iframe's `src` never changed between
  runs — only a `postMessage` was sent into whatever document was already
  loaded there. A tab that had the Preview open before D17 shipped kept running
  that pre-fix document forever; no edit to `frame.html` on disk could reach it,
  because nothing ever told the iframe to reload. Confirmed server-side that
  the fixed file was being served correctly (curl, cache headers fine); the gap
  was purely that the already-loaded document was never replaced.
- **The `frameReady` reset matters independently:** without it, a stale `true`
  left over from the previous iframe generation could let code be posted into
  a brand-new iframe before its message listener has attached —
  `postMessage` into a frame that isn't listening yet drops silently, which
  would have produced a blank preview with no error at all, a worse failure
  mode than the one being fixed.
- **Consequence:** every click of Run now does a genuine fresh load of the
  preview document, not just a new bundle. Slightly more work per run (a real
  page load of `frame.html` plus its import-mapped vendor files, all served
  locally and small); worth it for the guarantee that the preview can never
  again run on a stale document.
- **Still not verified in a live browser** — see D17's note on tool availability.

### D19. Preview run coordination extracted into a tested, framework-free class
- **Decision:** `src/preview/ready-gate.ts`'s `ReadyGate` replaces the
  `useState` + two-`useEffect` coordination in `PreviewFrame.tsx` that decided
  when to post the bundled code into the iframe.
- **Reason:** D18's fix (reset readiness per iframe generation) was correct in
  intent but removed `frameReady` from the build effect's dependency array —
  which also removed the only thing that re-checked readiness once the bundle
  finished. `pendingCode.current = result.code` is a ref write; it triggers no
  re-render, so if the iframe became ready *before* the bundle finished (the
  common case for a small app, not an edge case), nothing ever sent the code.
  Result: a blank preview, zero console output, zero errors — confirmed by the
  next screenshot, which matched this exactly rather than a module-loading
  failure (which would have produced a console error).
- **Why a class instead of fixing the effect again:** two React fixes in a row
  each repaired one ordering and silently broke the other, because the
  correctness condition — "send once, only once both signals for the same
  generation have arrived, in whichever order" — has nothing to do with
  render cycles, and expressing it through render-triggered effects kept
  reintroducing exactly that dependency. `ReadyGate` is seven lines of state
  machine with no React in it, fully covered by `ready-gate.test.ts`,
  including the precise ordering that broke in production
  (`markReady()` before `setCode()`) and the cross-generation case D18 was
  for. `PreviewFrame` now only calls `reset()`, `markReady()`, `setCode()`.
- **Still not verified in a live browser.**

### D20. The flipkart-cart question has real CSS
- **Decision:** `questions/flipkart-cart/files/src/App.css`, imported from the
  read-only `App.jsx`, styled against plain tags and the existing
  `data-testid` attributes -- no className additions to any component, so the
  bug-relevant files are untouched. Question version bumped 2 → 3.
- **Reason:** the question had no CSS at all. It was generated from the eval
  test fixture during phase 2a, built to prove the engine works, not as a
  polished example. User asked directly why; this was the honest answer, and
  they asked for it to be fixed.

### D21. esbuild's CSS output is a separate file -- bundler.ts was discarding it
- **Decision:** `bundlePreview` now extracts both the `.js` and `.css` entries
  from `result.outputFiles` and returns `{ code, css }`; `frame.html` injects
  `css` into a dedicated `<style id="debuglab-question-css">` element,
  replaced (not appended) on every run.
- **Reason:** found while verifying D20 live -- the styled question rendered
  completely unstyled. Direct probe of esbuild confirmed `outputFiles.length
  === 2` for a bundle with one CSS import (one `.js`, one `.css`); the
  bundler's existing code (`result.outputFiles?.find(f => f.path.endsWith(
  '.js'))`) only ever took the first, silently dropping the second. The build
  gate's own comment ("Required even with write:false, so a stylesheet
  import can emit") shows this was known about at the build-succeeds level
  during the C1 fix, but never followed through to actually using the output.
- **`ReadyGate` generalised to `ReadyGate<T>`** (was string-only) to carry
  `{code, css}` as one coordinated payload; `setCode` renamed `setPayload`.
  Its 8 existing tests needed only a method-name and type-param update, no
  logic changes -- the coordination behaviour the class exists to guarantee
  doesn't care what shape the payload is.
- **Tested with the real, empirically-verified output shape**, not a
  restated assumption: a genuinely real (unmocked) end-to-end test isn't
  practical here, since `bundlePreview` hardcodes a browser-only
  `wasmURL: '/preview/esbuild.wasm'` that cannot resolve under Node/Vitest.
  The mock in `bundler.test.ts` reproduces the exact `outputFiles` shape
  confirmed by direct probe before being encoded as a test.

### D22. "Open in new tab" -- a real top-level browser tab for real DevTools
- **Decision:** `PreviewFrame` exposes `openInNewTab()` via
  `useImperativeHandle`; `SolveScreen` wires it to a button next to the
  Preview tab. `window.open('/preview/frame.html', ...)` opens the identical
  app as a genuine top-level page -- not sandboxed, a normal
  `http://localhost:3000` origin -- so right-click Inspect, F12, Sources and
  breakpoints all work exactly as on any other page. Kept in sync: every
  later Run (or edit-triggered rebuild) also posts the new payload to it,
  distinguished from the embedded iframe's messages via `event.source`.
- **Reason:** user asked directly for a way to use real browser DevTools on
  the preview, not just the app's own mini console/network panels. This was
  already in the original phase-2a plan's UI description ("Preview tab: live
  app + Open in new tab button") but never built.
- **`frame.html`'s `post()` generalised** to target `window.opener` when
  present (the popup case) and fall back to `parent` (the iframe case) --
  the same file serves both, since which one applies depends only on how the
  page was opened, not on anything in the file itself.
- **Consequence that became D23**: the popup reference must survive the user
  switching away from and back to the Preview tab.

### D23. PreviewFrame stays mounted across tab switches, visibility only
- **Decision:** `SolveScreen` no longer conditionally renders the Code pane
  OR the Preview pane via a ternary. Both are always in the tree; only
  `display: none` toggles which is visible.
- **Reason:** found live, testing D22. Switching to the Code tab unmounted
  `PreviewFrame` (it lived in the `false` branch of the ternary), which
  destroyed `popupRef` -- a plain component-scoped ref. The already-open
  popup tab kept running untouched, but the component's only reference to it
  was gone: no further Run would ever reach it again, silently, with nothing
  in the UI to say why. Switching back to Preview also remounted a brand new
  `PreviewFrame` instance, which re-ran its build effect on mount regardless
  of whether `runToken` had changed -- meaning every glance at the Code tab
  and back was silently forcing a full rebuild-and-reload of the preview,
  unnoticed until now because testing always clicked Run immediately before
  checking Preview, which masked it.
- **Verified live**, not just reasoned about: opened the popup, switched to
  Code, edited and fixed the code, switched back, clicked Run, then checked
  the popup via direct JS execution in it -- confirmed `Cart: 1`,
  `"Running Shoe"` in the cart, after the exact sequence that previously left
  it permanently stuck on the pre-fix app with cart count 0.
- **Also fixes an unannounced inefficiency**: returning to Preview after
  editing code no longer re-bundles and reloads unless Run is actually
  clicked.

## 2026-10-29 to 2026-11-03 — Hints, gated solutions, full-repo editing, real-test grading

Several sessions' worth of decisions that should have been logged at the time
and were not; recorded together now, backfilled from the actual conversation
record rather than from memory.

### D24. Every question's editable surface widened to the whole `src/` tree
- **Decision:** all `questions/*/files/src/**` files became `editable`
  (previously only the one or two files that happened to contain the bug
  were). `mock/handlers.js` and `notes/author-notes.md` are the only files
  that stay `readonly`/`hidden`, unchanged.
- **Reason:** the *set* of editable files was itself a spoiler -- a learner
  given only `CartContext.jsx` as editable already knows that's where the
  bug is, before reading a line of code. Full-repo editing (one of several
  initiatives discussed) was the one actually chosen to ship.
- **Alternatives rejected:** a genuinely separate "full repo, no editable
  restriction" learner *mode* as its own initiative, built alongside the
  existing restricted mode. Rejected for now in favour of just widening the
  existing mode -- two parallel question formats would double the authoring
  surface for a distinction (which files are editable) that doesn't change
  how a question is graded.
- **Still true:** `mock/handlers.js` must stay readonly (a learner could
  "fix" a bug by making the fake backend lie instead of fixing real code)
  and hidden author notes must stay hidden (they name the bug outright).

### D25. `esbuild-wasm` added to `serverExternalPackages`
- **Decision:** `next.config.ts`'s `serverExternalPackages` gained
  `'esbuild-wasm'` alongside the existing `'esbuild'`.
- **Reason:** found by actually running `npm run build` (the real Vercel
  build command) for the first time all session -- previously only `next
  dev` had been exercised. Production SSR renders `SolveScreen.tsx`'s
  (`'use client'`) initial HTML server-side, pulling `bundler.ts` -- and
  therefore `esbuild-wasm` -- into the SSR module graph. `esbuild-wasm`'s
  module has a Node `child_process` code path (for native CLI use) whose
  spawn target Turbopack cannot statically resolve, failing the whole build,
  even though that code path is never reached during SSR (`bundlePreview()`
  only runs inside a `useEffect`).
- **Verified**, not just reasoned about: reproduced the exact Vercel failure
  locally with `npm run build`, applied the fix, confirmed a clean build
  (TypeScript included) before telling the user to redeploy.

### D26. Hints are revealed one at a time through their own route, never bundled upfront
- **Decision:** `QuestionMeta.hints: string[]` (ordered least to most
  revealing), served via `GET /api/questions/[slug]/hints?index=N` →
  `{ hint, hasMore }`. Excluded from `toLearnerQuestion`'s payload the same
  way the rubric and reference fix are.
- **Reason:** bundling all hints into the initial page load would let a
  learner read the network response or page source and see every hint at
  once, defeating "revealed one at a time" even though hints aren't as
  sensitive as the rubric.
- **Alternatives rejected:** revealing all hints at once in a collapsed
  section (simpler, but the user explicitly asked for progressive reveal);
  hand-writing hints as plain UI copy with no backing data (loses the
  per-question authoring consistency the rest of the question model has).

### D27. Solution reveal: free after passing, costs the question's score if used before
- **Decision:** two routes. `GET /api/questions/[slug]/solution` (no side
  effect; the SolveScreen only shows its button once `result.passed` is
  true) for reviewing the reference fix after a genuine pass. `POST
  /api/attempts/[slug]/give-up` permanently marks that user+question
  ineligible to score (`grade()`'s new `gaveUp` dependency, checked on every
  submission, cached or fresh) before handing back the same reference fix.
- **Reason:** a learner who views the solution and pastes it back must never
  be indistinguishable from one who actually solved it. A single endpoint
  with a "did they already pass" check would not catch this -- give-up has
  to be its own action with its own permanent consequence, independent of
  whether a later submission happens to pass.
- **Known limitation, accepted rather than fixed:** there is still no login
  (D12), so "permanently ineligible" is tracked per browser session against
  a shared local user id, the same limitation the existing spend ceiling and
  first-pass tracking already have -- not a new gap this introduced, but
  worth naming again here since it directly affects what "give up" enforces.

### D28. A second grading mode: real executed tests, run server-side, for one question so far
- **Decision:** `QuestionMeta.gradingMode: 'llm' | 'tests'` (default `'llm'`,
  every prior question unaffected). For `'tests'`, Submit skips `grade()`'s
  LLM path entirely and calls `executeTests()`
  (`src/grading/execute-tests.ts`): it bundles the submission plus a ported
  test file with the server's real `esbuild` (reusing `src/bundling/
  resolve.ts`, the same resolver `build-gate.ts` uses) and executes the
  bundle in a `node:vm` context -- real PASS/FAIL, real assertion messages,
  never an LLM's paraphrase of them.
- **Reason:** the user added a complete standalone lab (React + Express +
  SQLite, with a real `node:test`/Vitest suite) and asked whether the
  platform could support something like it. Running the real lab as-is was
  rejected (`better-sqlite3` is a native module with no browser path, and
  stock sandboxed execution was explicitly out of scope per D1); the chosen
  middle path simulates the backend+DB client-side (reusing the existing
  mock-handler/interceptor pattern, no new infrastructure) while keeping
  grading itself genuinely real rather than LLM-judged.
- **Why server-side, not just the learner's own browser:** a browser-only
  "run tests and self-report" design would let a technically sophisticated
  learner tamper with the test harness in their own devtools to fake a
  pass. Submit never trusts the client for the LLM path either; the same
  rule applies here.
- **New dependencies:** `jsdom` + `@types/jsdom`, needed only because a
  ported test that renders real React components (via `react-dom/client` +
  `act()`) needs a real DOM. Dev/server-only, never shipped to the browser.
- **Hand-rolled `describe`/`it`/`expect` harness** (`src/testing/
  browser-test-harness.ts`) instead of bundling `vitest`/`node:test`
  themselves: neither is meant to run inside a bundled `node:vm` script, and
  the ported tests only ever use a small, known set of assertions.
- **`node:vm`'s own `timeout` option only bounds synchronous execution** (an
  infinite `while(true)`); it does not interrupt code awaiting a promise or
  timer that never resolves. The real wall-clock bound is a `Promise.race`
  in `executeTests()`; the vm `timeout` is kept too, as a second, cheaper
  line of defence for the synchronous case. This is not a hard security
  boundary (bare `vm` contexts are not escape-proof against someone
  deliberately trying) -- adequate for grading a debugging exercise, not for
  arbitrary untrusted execution.
- **Known, accepted limitation:** a ported test that renders real components
  leaves a couple of Node `MessagePort` handles open per run (React's
  scheduler re-refs them internally in a way that could not be overridden
  without silently breaking its own message delivery -- tried, reverted).
  Harmless for this deployment (the Next.js server is already long-running
  and does not need to exit between requests), but worth knowing if handle
  counts ever matter under sustained load.
- **First question built on this:** `questions/flipkart-cart-lab/`, ported
  from the user's lab -- all three of its real bugs, 12 of its 15 original
  tests (3 generic auth-edge-case tests not tied to any of the three bugs
  were trimmed; noted in the question's own hidden author notes, not just
  here).
