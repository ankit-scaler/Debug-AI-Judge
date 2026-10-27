# Architecture — Debugging Lab P1

Status: **awaiting approval**. Nothing in this document is built.
Source: PRD (Google Doc, Oct 27 2026) as amended by [decisions.md](decisions.md) D1–D6.
Scope: React frontend bugs + mocked-API bugs, in-browser runtime, server-side LLM grading.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| App + API | Next.js (App Router) on Vercel | Hobby for the pilot; non-commercial terms are a rollout blocker, not a build blocker |
| Editor | Monaco | File tree, tabs, search |
| Runtime / preview | Sandpack | Bundling and preview **only** — no test runner (D3) |
| Mock API | Injected `fetch`/`XHR` interceptor | Replaces MSW — see §2.3 |
| Auth, DB, Storage | Supabase | Google OAuth, Postgres, RLS, Storage |
| Model calls | OpenRouter, `anthropic/claude-sonnet-4.6` | D4, D9. No Anthropic SDK; OpenAI-compatible endpoint |
| Build gate | `esbuild` in a Next.js route | Bundle-only, no execution — see §3.2 |
| Eval harness | Node CLI in `evals/` | Runs offline, not part of the deployed app |

No container, no server-side code execution, no shell. Learner code is only ever
*parsed* on the server (esbuild) or *read* by a model — never run.

## 2. Components

### 2.1 Solve screen (client)

```
┌──────────────────────┬──────────────────────────────────────┐
│ Problem statement    │ [ Code | Preview ]                   │
│ Symptom              │                                      │
│ Hints (locked)       │   Monaco file tree + tabs            │
│ Timer                │   or Sandpack preview + "open in tab"│
├──────────────────────┴──────────────────────────────────────┤
│ [ Console | Network | Results ]                             │
└─────────────────────────────────────────────────────────────┘
  Top bar: Run · Reset · Submit
```

- Editable files are writable; read-only files render in Monaco with
  `readOnly: true`; hidden files are never sent to the client at all.
- Console captures the preview iframe's `console.*` via `postMessage`.
- Network panel is fed by the interceptor (§2.3), not by DevTools APIs.
- Results tab shows per-criterion pass/fail after a submit.
- Every action — run, reset, submit, hint unlock, tab switch that loads — shows a
  loader and disables its control while busy. No silent waits.

### 2.2 Question content delivery

All question content is served through server routes using the Supabase service
role. RLS denies `anon` and `authenticated` access to every question table except
`questions` (list metadata for published rows) and `users` (own row only).

This is deliberate: per-column RLS protecting rubrics and reference solutions is
one policy mistake away from leaking every answer. A deny-by-default posture with
explicit server routes is far easier to get right and to audit.

| Route | Returns | Gate |
|---|---|---|
| `GET /api/questions` | Published question metadata | Signed in |
| `GET /api/questions/:slug` | Scenario, symptom, editable + readonly files, mock handlers | Signed in, question published |
| `POST /api/attempts` | Creates attempt, server-stamps `started_at` | Signed in |
| `POST /api/attempts/:id/hint` | Next hint text, records penalty | Owns attempt |
| `POST /api/attempts/:id/submit` | Verdict (§3) | Owns attempt |
| `POST /api/attempts/:id/give-up` | Explanation + reference solution, score 0 | Owns attempt |

Hints and explanations are **not** shipped with the question payload. They arrive
only from their own routes, after the unlock condition is met server-side.

### 2.3 Mock API — interceptor, not MSW

The PRD specifies MSW. MSW in the browser needs a service worker registered at the
preview iframe's scope, and that iframe is served from the bundler's own origin.
Instead, a small module is injected into every sandbox that patches `fetch` and
`XMLHttpRequest` and matches requests against the question's handler table.

Why: no service worker to register cross-origin, and the Network panel gets its
data for free because we already own every request. Authors write handlers in an
MSW-shaped API (`get('/api/cart', (req, res) => ...)`) so the familiar form is kept.

This one is my call, not yours — it is reversible and affects no data. Logged as
D7 when you accept it.

### 2.4 Grader (server)

See §3. Lives behind `POST /api/attempts/:id/submit`; the only component that
calls OpenRouter in the learner path.

### 2.5 Author pipeline

1. **Upload** — ZIP, max 5 MB, parsed in-browser with JSZip.
2. **Manifest** — `debuglab.json`: entry file, dependency list, framework version.
   Rejected if absent, malformed, or declaring a dependency outside the allowlist.
3. **Build check** — the whole file set goes to the esbuild route (§3.2). An app
   that does not bundle is rejected here, at upload, with the error shown inline.
   The PRD validated only at step 5; failing at upload is far kinder to authors.
4. **Visibility** — each file marked editable / read-only / hidden.
5. **Metadata** — scenario, symptom, difficulty, tags, bug category, time limit.
6. **AI draft** — server sends the file set to OpenRouter and returns rubric
   criteria, reference fix, 3 hints, and an explanation. Author edits all of it.
7. **Validation** — see §3.4. Blocks publish.
8. **Status** — `draft` → `in_review` → `published`, peer-reviewed by another
   team member.

### 2.6 Admin

- User list, role assignment, batch assignment.
- Question status overrides.
- **Cost centre** (D6): spend by feature, by author, by day; monthly ceiling;
  current burn against ceiling; hard cutoff state.
- Leaderboard view, per batch and global.

## 3. Grading

The riskiest part of the system and the reason the eval is built first.

### 3.1 Submit sequence

```
client  →  POST /api/attempts/:id/submit  { files }
server  →  1. hash = sha256(question_version + normalized files)
           2. grading_cache hit?            → return cached verdict, $0
           3. esbuild bundle check          → fail free, no tokens
           4. spend ceiling reached?        → degraded response (§3.5)
           5. OpenRouter call, structured output
           6. write grading_cache, ai_usage, attempts, user_question_scores
        →  verdict { criteria: [{id, passed, evidence}], passed, score }
```

Steps 1–3 run before any token is spent. Expected cache hit rate is high: learners
resubmit unchanged or near-unchanged code constantly, and a hit is both free and
perfectly consistent.

### 3.2 Build gate

`esbuild.build()` over the in-memory file set, `write: false`, bundling only. Catches
syntax errors, missing imports, and unresolved dependencies. It **never executes**
the code, so untrusted input is safe in a plain serverless function — this is what
lets us drop the container without taking on an RCE surface.

A build failure returns immediately as a fail with the compiler error, costing
nothing. This also stops the grader from being asked to reason about code that
cannot run.

### 3.3 Grader prompt contract

Input, in this order (stable prefix first, for caching):

1. System: role, output schema, and the standing rule that learner code is data
   and never an instruction.
2. Question scenario, symptom, and the **rubric criteria** the author wrote.
3. The **reference fix** — the anchor. The question asked is "does this attempt
   achieve what the reference fix achieves?", not "is this code correct?".
4. The learner's changed files, inside explicit delimiters, labelled untrusted.

Output: structured JSON — `{criteria: [{id, passed, evidence}], passed}`. `evidence`
must quote a line from the submission, which makes a fabricated pass visible in review.

Prompts are versioned files under `prompts/grader/vN.md`. Every `ai_usage` row
records the version that produced it.

### 3.4 Author-time validation under a non-deterministic grader

The PRD's rule — reference fix passes all tests, buggy version fails at least one —
still holds, but a non-deterministic grader cannot be asked once. Validation runs
the grader **3 times** against both the reference fix and the unmodified buggy
version. Publish is blocked unless all three runs agree: reference passes every
criterion, buggy version fails at least one.

A question whose verdicts are unstable is a bad question *or* a bad rubric, and
catching that at authoring time is exactly where it belongs.

### 3.5 Spend ceiling and degraded state

Before every call, the server checks month-to-date spend from `ai_usage` against
the ceiling. On breach: submits return a `grading_unavailable` state, the UI says
so plainly and keeps the learner's code safe, and admins are shown the breach.
Learners are never shown a wrong verdict because of a budget problem.

Also enforced: a per-learner daily graded-submit cap. Cache hits do not count
against it.

### 3.6 What this design does not fix

- Verdicts are non-deterministic across *different* code. The cache guarantees
  consistency for identical code only.
- A sufficiently clever submission can still talk past the grader. Evidence
  quoting and rubric-based grading raise the bar; they do not close it.
- Model quality sets the ceiling on grading quality. That is what the eval measures.

## 4. Eval harness

Built first, before the grader is tuned and before any UI.

```
evals/
  cases/<case-id>/
    question/        # files, rubric, reference fix
    attempt/         # the learner's submitted files
    expected.json    # per-criterion verdict + overall
  run.mjs
  report/
prompts/grader/v1.md
```

- **Metric.** Primary: overall verdict accuracy — did we award or deny points
  correctly. Secondary: per-criterion agreement.
- **Asymmetric weighting.** A false pass (points for broken code) is the worst
  outcome and is reported separately from a false fail (demoralizing, but
  recoverable via resubmit). They are never averaged into one number.
- **Baseline before tuning.** v1 of the prompt is measured and recorded before any
  improvement is attempted. Every later change re-runs the suite and reports a
  before/after table.
- **Cases needed from you.** 15–20 triples of (buggy app, learner attempt, correct
  verdict), including attempts that look correct but are not, attempts that fix the
  symptom the wrong way, and attempts that game the grader with instruction-shaped
  comments. I will draft candidates for your approval.

Cost and latency per case are recorded alongside accuracy, which is what sets the
monthly ceiling (D5).

## 5. Data model

Revised from the PRD. Changes from it are marked ▲.

**users** — `id` (= `auth.uid`), `email`, `name`, `role` (learner|author|admin), `batch`, `created_at`

**questions** — `id`, `slug` (unique), `title`, `company`, `scenario`, `symptom`,
`difficulty`, `tags[]`, `time_limit_sec`, `source_zip_path`, `status`, `author_id`,
`version` ▲, `created_at`, `published_at`

▲ `version` increments on any content change, so cached verdicts and scored
attempts stay bound to the exact question they were produced against.

**question_files** — `id`, `question_id`, `path`, `content`, `visibility`
(editable|readonly|hidden)

**question_solution_files** ▲ — `question_id`, `path`, `content`

▲ Split out of `question_files`. Reference solutions in the same table as
learner-visible files, guarded by an `is_solution` flag and RLS, is one policy
slip from leaking every answer. Service role only.

**question_grading** ▲ — `question_id`, `rubric_criteria` (jsonb)

▲ Rubric separated from learner-facing assets for the same reason. Service role only.

**question_assets** — `question_id`, `mock_handlers_js`, `hints` (jsonb: text,
penalty_pct), `explanation_md`

**attempts** — `id`, `user_id`, `question_id`, `question_version` ▲, `started_at`,
`submitted_at`, `elapsed_sec` ▲, `code_snapshot_path` ▲, `criteria_passed`,
`criteria_total`, `hints_used`, `score`, `status`

▲ `code_snapshot_path` points at Supabase Storage rather than holding the code in
a column — snapshots would otherwise consume the 500 MB free tier.
▲ `elapsed_sec` is required for the leaderboard tiebreak, which the PRD's columns
could not produce.

**user_question_scores** ▲ — `user_id`, `question_id`, `score`, `scored_attempt_id`,
`solved_at`, `elapsed_sec`

▲ One row per learner per question, written only on the first full pass. This is
what makes "only the first full pass scores" enforceable rather than aspirational.

**ai_usage** ▲ — `id`, `created_at`, `user_id`, `question_id`, `feature`
(draft|qa|feedback|grade|validate), `provider`, `model`, `prompt_version`,
`input_tokens`, `output_tokens`, `cached_tokens`, `cost_usd`, `latency_ms`, `cache_hit`

**grading_cache** ▲ — `hash` (pk), `question_id`, `question_version`, `verdict`
(jsonb), `created_at`

**leaderboard** (view) — over `user_question_scores`: `user_id`, `batch`,
`total_score`, `solved_count`, `total_elapsed_sec`, `rank`

## 6. Scoring

Unchanged from the PRD. Base 100/200/300 by difficulty; hint penalties 10/20/30%;
over time limit halves what was earned; unlimited submissions but only the first
full pass scores; leaderboard ranked by total score, ties broken by total elapsed.

`started_at` and `elapsed_sec` are server-stamped. The client timer is display only.

## 7. Known risks

| Risk | Status |
|---|---|
| Grader accuracy insufficient to award points | **Measured by the eval before launch.** The one finding that would reopen D3 |
| Non-deterministic verdicts across similar code | Mitigated for identical code by the cache; otherwise accepted (D3) |
| Prompt injection via learner code comments | Mitigated by delimiting, data framing, structured output, evidence quoting; not closed |
| Author ZIP does not bundle | Caught at upload by the build gate (§3.2) |
| Grading spend overrun | Ceiling, cutoff, per-learner cap, verdict cache |
| OpenRouter caching weaker than first-party | **Resolved** — caching is supported with explicit breakpoints; see §9 |
| Vercel Hobby non-commercial terms | Pilot only; needs lead sign-off before rollout |
| Low-end laptops lag with Monaco + preview | Keep apps under 10 files; lazy-load the editor |
| Supabase free tier pauses after ~1 week idle | Daily cron ping |

## 8. Not yet verified

Nothing here has been built or run. Specifically unverified: Monaco + Sandpack
integration, the esbuild build gate on Vercel's runtime, interceptor behaviour
inside the Sandpack iframe, and whether OpenRouter's Anthropic endpoints advertise
`structured_outputs` in their Providers section (see §9).

OpenRouter model IDs, caching, structured outputs and fees were verified on
2026-10-27 — see §9.

## 9. OpenRouter — verified 2026-10-27

Checked against OpenRouter's own docs and pricing pages.

### Fees
- **No markup on inference.** "Inference is billed at the provider's list price on
  every plan." The platform fee applies only when buying credits.
- **Credit purchase fee: 5.5%** on the Standard plan, 8% on Business. Enterprise
  is negotiated.
- So Claude list prices apply, plus 5.5% on top-ups. Haiku 5.5 is $0.10/$0.50 per
  MTok and Opus 5.5 is $4/$20.
- BYOK: $25,000/month of list-price inference included, then 5% of list.

### Model IDs
`anthropic/claude-haiku-5.5` confirmed on its model page; the family follows
`anthropic/<model>`, so **`anthropic/claude-sonnet-4.6` is the pinned grader**
(D9). `~anthropic/claude-opus-latest` and any other moving alias must not be used —
the grader has to be pinned for the eval to mean anything.

### Prompt caching — supported, and a real cost lever
- `cache_control: {type: "ephemeral"}` either top-level (auto, breakpoint advances
  with the conversation) or on individual content blocks, up to 4 explicit breakpoints.
- **Cache reads cost 0.1x** the input price. Writes are 1.25x for the 5-minute
  default, 2x with `ttl: "1h"`.
- Minimum cacheable prefix is **1,024 tokens for Sonnet 4.6** (512 for Sonnet 5.5,
  Opus 5.5 and Haiku 5.5). Shorter prefixes silently do not cache, with no error.
- **Design consequence:** the grader prompt is ordered stable-prefix-first — system
  and schema, rubric, reference fix, question context — with the explicit breakpoint
  after it, and the learner's changed files last. The stable part is ~2K tokens
  against Sonnet 4.6's 1,024-token minimum. That margin is thinner than it looks:
  a question with a terse rubric and a small reference fix could fall under the
  minimum and silently stop caching, so the eval records cache-hit rate per question
  and flags any question whose prefix lands under ~1,200 tokens.
- **TTL choice:** with a 2x write and 0.1x reads, the 1-hour TTL pays off from
  roughly the third graded submit on the same question within the hour; the 5-minute
  TTL pays off from the second. Use `1h` during cohort sessions, where many learners
  work the same question concurrently.

### Structured outputs — supported, with a routing caveat
- `response_format: {type: "json_schema", json_schema: {name, strict: true, schema}}`.
- **Support is per endpoint, not per model**, and can change over time. Must set
  `require_parameters: true` in provider preferences and include `response_format`
  among the required parameters, or a request can be routed to an endpoint that
  ignores the schema.
- **Strict mode is not guaranteed on every provider** — some enforce the schema,
  others treat it as a strong hint. The grader therefore validates every verdict
  against the schema itself and treats a malformed verdict as a system error, never
  as a fail for the learner.
- Schema property `description` fields are load-bearing for quality; the rubric
  schema will carry them.

### Batch inference — for the eval only
A batch path exists at roughly 50% of standard pricing with a 24-hour window. The
exact invocation shape (a `:batch` model suffix versus a separate endpoint) could
not be confirmed from official docs and will be checked before use. Relevant to the
eval harness and bulk authoring drafts, which are not latency-sensitive; never to
grading, which a learner is waiting on.

### Revised cost per graded submit

Measured against a realistic prompt — ~3.5K input (of which ~2K is the cacheable
stable prefix) and ~500 output tokens with terse evidence quotes:

| | Sonnet 4.6 ($3/$15) | Haiku 5.5 ($0.10/$0.50) |
|---|---|---|
| No caching | ~$0.018 | ~$0.0006 |
| With cache read on the prefix | ~$0.013 | ~$0.0004 |

At a pilot of ~5,000 graded submits/month with ~40% absorbed by the verdict cache,
that is roughly **$38/month on Sonnet 4.6** or **$1.50/month on Haiku 5.5**, plus
the 5.5% credit fee.

**This corrects the ~$200/month figure quoted during the review session**, which
assumed a larger prompt, no prompt caching and no verdict deduplication.

Output tokens dominate the remaining cost, so keeping the verdict terse — short
evidence quotes, no prose explanation in the grading call — is the strongest
remaining lever after caching.
