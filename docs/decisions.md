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
