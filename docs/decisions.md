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
