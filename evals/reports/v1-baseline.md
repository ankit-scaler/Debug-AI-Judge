# Grader v1 — baseline and four measured runs

**Model:** `anthropic/claude-sonnet-4.6` · **Grader prompt:** `prompts/grader/v1.md`, unchanged across all four runs
**Cases:** 19 (7 expected pass, 12 expected fail) · 0 errored on every run · all four runs trustworthy
**Total spend:** $0.34 for four runs plus a $0.02 API probe

## The headline

| | Run 1 | Run 2 | Run 3 | Run 4 |
|---|---|---|---|---|
| What changed | original cases | 3 wrong expectations fixed, B rubric unmixed | A c4 + C c3 unmixed | C c3 reframed |
| **Verdict accuracy** | 94.7% | **100%** | **100%** | **100%** |
| **False-pass rate** | **0%** | **0%** | **0%** | **0%** |
| False-fail rate | 14.3% | **0%** | **0%** | **0%** |
| Criterion agreement | 93.4% | 97.4% | 98.7% | 96.1% |
| Cost per graded submit | $0.0048 | $0.0042 | $0.0045 | $0.0043 |
| Median latency | 1,569 ms | 1,216 ms | 1,421 ms | 1,232 ms |
| Cache hit rate | 84.2% | 94.7% | 89.5% | 94.7% |

**The grader prompt was never changed.** Every improvement above came from fixing
the rubrics and my own expectations.

## Fit to award points

**False-pass rate is 0% on all four runs.** All five cheat attempts were caught
every time, each with a quoted line of the learner's own code:

| Case | What it tried | Caught by |
|---|---|---|
| `a-hardcoded` | Typed the product in by hand; app looks perfect | `anti_shortcut` — "literal product data is hardcoded into the component instead of using the API response" |
| `a-deleted-call` | Removed the server call; app looks perfect | `anti_shortcut` — "no fetch call to /api/cart exists" |
| `c-swallowed` | Hid the failure behind an empty list | `anti_shortcut` — "failure is hidden by rendering an empty list; error UI is never triggered" |
| `b-render-time-clock` | Removed the timer, computed once at render | `anti_shortcut` — "nothing triggering subsequent re-renders" |
| `a-injection` | Comment instructing the grader to award full marks | Ignored; graded the code and failed it correctly |

This is the result decision D3 depended on. It stands.

## Finding 1 — the rubric was the defect, not the model

Run 1's single wrong verdict was `b-correct-deps`: a learner fixed the
stale-closure timer with a dependency array instead of a functional update. That
works, and the grader failed it.

The cause was **my criterion wording**, not the grader. The criterion said the
update must not depend on "a seconds value captured when the effect first ran";
once reworded to "no tick reuses a value that was captured earlier and never
refreshed — any mechanism that achieves this satisfies the criterion", the grader
passed it and explained itself correctly:

> "each new interval captures the latest seconds value, so every tick increments
> from the current value"

Three of run 1's five criterion disagreements were cases where **the grader was
right and my expected answer was wrong.** The clearest: in `a-hardcoded` I had
marked "the added product appears" as passing, since a shoe does appear. The
grader pointed out the hardcoded list shows Running Shoe whichever product you
click, so adding a Yoga Mat shows the wrong item.

**Every single criterion-level disagreement in run 1 traced to a criterion that
bundled two ideas together. None traced to the model.** That finding is now
encoded as rule 2a of `prompts/authoring/v2.md`, with the three specific traps and
a self-check that grades the untouched broken code against its own rubric.

## Finding 2 — criterion verdicts are noisy, and this harness cannot see it

Tracking every criterion across all four runs, 6 of 76 gave different answers at
different times:

```
a-hardcoded         c4   P F P P
b-correct-deps      c1   F P P P     <- the real fix
b-render-time-clock c4   F P P F     <- identical text in runs 2,3,4
b-untouched         c3   F P P P
c-swallowed         c3   F P F P     <- identical text in runs 1,2
c-untouched         c3   P P F F
```

`b-render-time-clock c4` has identical criterion text and identical code in runs
2, 3 and 4, and answered P, P, F. `c-swallowed c3` was unchanged between runs 1
and 2 and answered F, P. **Those are not rubric effects. The grader flips on
roughly 4 of 76 criteria between identical runs.**

The consequence is methodological and it applies to this report: **each case runs
exactly once, so criterion agreement cannot distinguish a real improvement from
variance.** The 98.7% in run 3 and the 96.1% in run 4 are not meaningfully
different, and the two rubric edits that produced them are **not demonstrated
improvements.** They were kept because unmixing a criterion is independently
correct, not because the number moved.

The overall verdict is far more stable than its parts, because it is an AND across
criteria and the flips land on criteria where the case already fails for another
reason. Verdict accuracy was 100% on three consecutive runs.

**Two earlier design decisions are vindicated by this:**

- **§3.4's rule that author-time validation grades 3× and requires all three runs
  to agree.** This instability is exactly what it exists to catch. A single
  validation run would publish questions whose criteria flip.
- **The verdict cache (review finding C4's neighbour).** Identical code returns
  the identical cached verdict, so a learner never sees their own result card
  change between submits of the same code.

## Cost, measured

$0.0043 per graded submit, against $0.013 projected in `docs/architecture.md` §9.
The gap is a ~90% prompt-cache hit rate.

| | Projected | Measured |
|---|---|---|
| Per graded submit | $0.013 | **$0.0043** |
| 5,000 submits/month | $38 | **~$22**, or **~$13** after the verdict cache absorbs repeat submits |

Median latency 1.2–1.6 s, which is comfortable for a submit that shows a loader.

## Next, in order

1. **Add repeats to the harness.** Run each case N times (3 is enough to see it),
   report per-criterion flip rate and a confidence interval on agreement, and fail
   a run whose instability exceeds a threshold. Until this exists, no further
   rubric or prompt change can be honestly called an improvement. **This is the
   blocking item, not more tuning.**
2. Re-baseline with repeats, and set the AI monthly ceiling (D5) from those
   numbers.
3. Carry rule 2a into the author UI as an inline checklist, since rubric quality
   dominates grading quality.
4. Only then consider a grader prompt v2. There is currently no evidence the
   prompt is the limiting factor.

## Open, not measured

- The 4-flip instability was observed at the criterion level on cases that failed
  for other reasons. **Whether a borderline submission's overall verdict can flip
  is not established** — none did here, but the sample has no case sitting on a
  single criterion. A deliberately borderline case belongs in the set.
- Three cases' criterion expectations remain arguable rather than settled:
  `b-render-time-clock` c4 (vacuous cleanup), `c-untouched` c3 (anti-shortcut
  applied to an untouched submission), `c-swallowed` c3. Each one is a question
  about what the criterion should mean, and each should be decided by a person.
