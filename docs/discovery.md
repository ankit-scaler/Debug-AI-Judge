# Discovery

## 2026-10-27 — PRD review session

Input: Google Doc "Debugging Lab: PRD (P1 Frontend/Full-stack)", Oct 27 2026.
Format: one question at a time, with options. Decisions are logged in
[decisions.md](decisions.md).

### Q1. What's in P1's build scope?
**Answer:** React + mock API only. PGlite/SQL questions and the embedded React
DevTools panel move to P2. (Recommended option.)

### Q2. How do authors get a broken app into a question?
**Answer:** ZIP upload, as the PRD specifies. Recommendation had been a pinned
React template with a fixed dependency set; user chose ZIP for flexibility.

### Q3. The browser decides pass/fail and POSTs the result, so a learner can forge
a full-marks submission without writing code. What should P1 do about it?
**Answer:** server-side verification in P1. (See Q4 — this then changed shape.)

### Q4. Where does the test runner live, and what's the monthly ceiling for it?
**Answer (user, redirecting the question):** "Can we use Claude API key for testing
if this is working correct or not? Using OpenRouter also, keeping cost centre as
well for admin."

Response given: LLM grading was argued against for pass/fail — non-deterministic
scores, prompt-injection surface in learner code, and no cost advantage over a
container ($5-10/mo vs ~$0.04/submit on an Opus-tier model). Three places the API
does earn its keep were proposed instead: author drafting (replacing the PRD's
copy-paste step), author-time question QA, and learner feedback on a failed submit.

### Q5. Where does the authoritative pass/fail check run? (re-asked, with LLM
grading on the ballot and priced)
**Answer:** Claude API grades the fix. User's decision, made after the argument
against it. Hardening mitigations agreed — see D3 in decisions.md.

### Q6. How do we bill the model calls?
**Answer:** OpenRouter. Read as a procurement constraint (existing OpenRouter
budget, no Anthropic billing relationship).

### Q7. What's the monthly ceiling for model spend?
**Answer:** set it after the eval. Build the eval, measure accuracy and cost per
graded submit across model tiers, then set the ceiling from real numbers. The
ceiling must exist before learners get access.

## Still open — user to answer

Carried over from the PRD's own "Open questions" section, all four unchecked there.
Q4 (budget) is now partly answered by Q7 above.

1. Which batch pilots first?
2. Is Scaler branding required, or own brand?
3. Who peer-reviews questions before publish?

## Raised but not yet resolved

- **Golden dataset for the grader.** The grader decides points, so it needs a
  golden set of (buggy app, learner attempt, correct verdict) triples, a written
  rubric, and a baseline score before launch. Offered to draft 15-20 candidate
  cases including attempts that look correct but are not, for approval.
- **Data model fixes** flagged during review, not yet folded into the PRD:
  - `attempts.code_snapshot` as a column will eat the Supabase 500 MB free tier —
    move snapshots to Storage, keep a path.
  - Hidden tests / rubrics and reference solutions sit in the same tables as
    learner-visible files, guarded by RLS alone; one wrong policy leaks every
    answer. Serve them only through a server route, never exposed to the anon key.
  - "Only the first full pass scores" and "ties broken by total solve time" are not
    derivable from the listed columns — need `elapsed_sec` on attempts and a
    per-(user, question) scored row.
- **Vercel Hobby's non-commercial terms.** Fine for an internal pilot, a blocker
  for wider rollout. Needs the lead's sign-off.
