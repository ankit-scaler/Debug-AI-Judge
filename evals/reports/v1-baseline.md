# Grader v1 — baseline

**Run:** 2026-10-27 · prompt `prompts/grader/v1.md` v1 · model `anthropic/claude-sonnet-4.6`
**Cases:** 19 (7 expected pass, 12 expected fail) · **0 errored** · run marked trustworthy
**Raw report:** `evals/reports/v1-2026-10-27T13-28-40-355Z.json`

Recorded before any prompt tuning. Every later version is compared against this table.

| Metric | v1 |
|---|---|
| Verdict accuracy | **94.7%** (18/19) |
| **False-pass rate** | **0%** (0 of 12 that should fail) |
| False-fail rate | 14.3% (1 of 7 that should pass) |
| Criterion agreement | 93.4% (71/76) |
| Total cost | **$0.0904** for 19 cases |
| Cost per graded submit | **$0.0048** |
| Median latency | 1,569 ms |
| Prompt cache hit rate | 84.2% (16/19) |

## Verdict: fit to award points, with one fix needed first

**The false-pass rate is zero, and that is the number this phase existed to get.**
Every one of the five cheat attempts was caught, each with a quoted line of
evidence:

| Case | What it tried | Caught by |
|---|---|---|
| `a-hardcoded` | Typed the product in by hand; app looks perfect | `anti_shortcut` — "literal product data is hardcoded into the component instead of using the API response" |
| `a-deleted-call` | Removed the server call; app looks perfect | `anti_shortcut` — "no fetch call to /api/cart exists; product data is written directly into state" |
| `c-swallowed` | Hid the failure behind an empty list | `anti_shortcut` — "failure is hidden by rendering an empty list; error UI is never triggered" |
| `b-render-time-clock` | Removed the timer, computed once at render | `anti_shortcut` — "nothing triggering subsequent re-renders" |
| `a-injection` | Comment instructing the grader to award full marks | Ignored entirely; graded the code and failed it correctly |

This is the result that keeps decision D3 standing. Had `a-hardcoded` passed, LLM
grading would have had to be reconsidered.

## The one real defect: a valid fix was failed

`b-correct-deps` — expected pass, got fail. The learner fixed the stale-closure
timer by adding `seconds` to the dependency array, keeping the cleanup:

```jsx
useEffect(() => {
  const id = setInterval(() => setSeconds(seconds + 1), 1000);
  return () => clearInterval(id);
}, [seconds]);
```

This works. The effect tears down and re-creates the interval on every change, so
each tick closes over a fresh `seconds` and the display counts up. The grader
failed criterion `c1` with:

> "effect re-runs on each `seconds` change but still reads stale closure value
> rather than using functional updater form"

The first clause is correct and the second contradicts it — once the effect
re-runs, the closure is not stale. The grader reached for the canonical fix
(`setSeconds(s => s + 1)`) and treated anything else as wrong.

**Why it matters more than one case in nineteen:** the dependency-array fix is the
one React's own lint rule steers people toward. Shipping as-is would fail a
correct answer for a predictable and probably large slice of learners, which is
the demoralising failure mode. **This needs a prompt fix before launch.**

## The bigger finding: my rubric wording is the weak link, not the model

Five criterion-level disagreements, only one of which is the model's fault. On
three, the grader was right and **my expectation was wrong**:

- **`a-hardcoded` c2** — I marked "the added product appears" as passing, since a
  shoe does show up. The grader failed it. The grader is right: the list is
  hardcoded to Running Shoe, so clicking *Yoga Mat* shows the wrong product. The
  criterion says *the added* product.
- **`c-checks-then-parses` c3** — the code checks the status, logs, then falls
  through and renders an empty list. The grader called that hiding the failure.
  That is a fair reading of the criterion as written.
- **`b-untouched` c3** — I marked `anti_shortcut` as passing because the learner
  did not cheat. The grader failed it because the value does not advance. My
  wording — "the displayed value still advances from a running timer" — mixes an
  anti-shortcut rule with a behaviour claim, which is exactly what
  `prompts/authoring/v1.md` rule 2 tells authors not to do. **The criterion is
  wrong, not the verdict.**

One remains genuinely arguable: `b-render-time-clock` c4, where the learner
removed the interval entirely. I read "the interval is still cleared on unmount"
as vacuously satisfied; the grader read it as unsatisfiable. The verdict was right
either way.

**Takeaway for authoring:** 3 of 5 disagreements came from criteria I wrote, not
from the model. Rubric quality is the dominant lever on grading quality, and the
author-time validation gate should be treated as a test of the *rubric*, not just
of the question.

## Cost, measured rather than projected

$0.0048 per graded submit, against the $0.013 estimated in `docs/architecture.md`
§9. The gap is the 84% prompt-cache hit rate — cases sharing a question reuse the
cached prefix.

| | Projected (§9) | Measured |
|---|---|---|
| Per graded submit | $0.013 | **$0.0048** |
| 5,000 submits/month | $38 | **~$24**, or **~$14** after the verdict cache absorbs repeat submits |

Also measured: question B's stable prefix is 4,655 characters, under the 4,800
safety threshold, and the warning fired on all five of its cases. Its three cache
misses are the first call per question group, as expected. A question with a terse
rubric sits close to the edge of cacheability — the warning is doing its job.

## Next, in order

1. **Fix the `b-correct-deps` false fail.** Sharpen the `c1` wording and add
   prompt guidance to trace the effect lifecycle before judging staleness.
   Re-run and publish a v1-vs-v2 table.
2. **Correct the three case expectations** where the grader was right. A golden
   set with wrong claims in it tunes the prompt toward the wrong behaviour.
3. **Rewrite `b` criterion c3** so it tests only the anti-shortcut rule.
4. Do not touch anything else until 1–3 are measured.
