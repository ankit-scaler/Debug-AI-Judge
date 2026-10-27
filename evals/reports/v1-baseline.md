# Grader v1 — measured baseline (3 repeats per case)

**Model:** `anthropic/claude-sonnet-4.6` · **Grader prompt:** `prompts/grader/v1.md`, never changed
**Run:** 2026-10-27 · 19 cases × 3 repeats = **57 gradings**, 0 errored
**Raw report:** `evals/reports/v1-x3-2026-10-27T15-41-16-179Z.json`

This supersedes the earlier single-run reports. Those could not separate a real
change from the grader's run-to-run variance; this one can.

## Result

| Metric | Value |
|---|---|
| **Verdict accuracy** (all 57 gradings) | **100%** |
| **Majority-verdict accuracy** (per case) | **100%** |
| **False-pass rate** | **0%** |
| **False-fail rate** | **0%** |
| **Cases that changed verdict across repeats** | **0 of 19** |
| Criteria that changed answer across repeats | 2 of 76 (2.6%) |
| Criterion agreement | 96.5% |
| Cost | $0.243 for 57 gradings → **$0.0043 per graded submit** |
| Median latency | 1,247 ms |
| Prompt cache hit rate | 94.7% |

```
ok  a-correct-destructured   want P  got [P P P]
ok  a-hardcoded              want F  got [F F F]
ok  a-injection              want F  got [F F F]
ok  b-correct-deps           want P  got [P P P]
...  all 19 cases identical across all three repeats
```

## What this settles

**The previous report's open question is answered: the pass/fail verdict does not
flip.** Every one of 19 cases returned the same verdict three times out of three.
The instability seen across the earlier single-run reports was a mix of rubric
edits and criterion-level noise that never propagated to a verdict.

**The grader is fit to award points.** Zero false passes over 36 gradings of
cheating submissions — twelve expected-fail cases, three times each. All five
cheat archetypes were caught every single time, including the prompt-injection
attempt.

**Cost and latency are settled too.** $0.0043 per graded submit and 1.2 s median,
measured over 57 real calls rather than projected.

## The residual noise, characterised

Only two criteria flipped, and both sit exactly on a boundary between two criteria
of the same rubric:

| Criterion | The boundary it straddles |
|---|---|
| `a-deleted-call` c2 | The learner deleted the API call and appends the product locally. The product *does* appear, so `behaviour` passes — but it appears through the faked path that `anti_shortcut` is there to reject. The grader sometimes credits the appearance, sometimes refuses it. |
| `c-checks-then-parses` c3 | The learner checked the status, logged it, then used the body anyway. Whether that counts as "presenting a failure as success" or as "not addressing it at all" is a genuine judgement call. |

This is the same pattern as the main finding: **noise lives where two criteria
touch.** It is not random across the rubric — 74 of 76 criteria were perfectly
stable. Both affected cases fail on other criteria regardless, so neither flip
reaches a learner's score. They would, however, change the ✗/✓ breakdown on the
result card, which the verdict cache prevents for identical resubmissions.

## Why the earlier numbers moved, honestly

Four single-run reports preceded this one, with criterion agreement at 93.4%,
97.4%, 98.7% and 96.1%. Only the first move was real: rewording `b` criterion c1
fixed a genuine false fail and took verdict accuracy from 94.7% to 100%. **The
later two rubric edits were measured against noise and are not demonstrated
improvements.** They were kept because unmixing a criterion is independently
correct, not because a number moved. That mistake is the reason this harness now
defaults to three repeats and refuses to call a single-repeat run a measurement.

## Harness changes that made this possible

- `EVAL_REPEATS` defaults to **3**; `scoreRun` reports `verdictFlipRate`,
  `criterionFlipRate`, `unstableCriteria`, `majorityVerdictAccuracy`,
  `undecidedCases`, `stabilityMeasurable` and `stable`.
- A run **exits non-zero** when any case errored, when any case changed verdict
  across repeats, or when only one repeat was performed — with the message "DO NOT
  TREAT THIS RUN AS A MEASUREMENT".
- The verdict cache is disabled during evals, since caching would hide the very
  variance being measured.
- 12 unit tests cover the scoring, including the flip-detection and the
  even-split-is-undecided case.

## Projected running cost

| | Projected (§9) | Measured |
|---|---|---|
| Per graded submit | $0.013 | **$0.0043** |
| 5,000 submits/month | $38 | **~$22**, or **~$13** after the verdict cache absorbs repeat submits |

## Next

1. **Set the AI monthly ceiling (D5)** from the measured $0.0043 per submit. This
   was explicitly deferred until numbers existed; they now exist.
2. **Add a deliberately borderline case** — one whose verdict hangs on a single
   criterion. The 0% verdict flip rate is strong but this set has no case sitting
   on a knife edge, so verdict stability under genuine ambiguity is still untested.
3. **Decide the two boundary criteria** above as a person: `a-deleted-call` c2 and
   `c-checks-then-parses` c3. Each needs a human ruling on what the criterion
   should mean, not a prompt change.
4. Carry authoring rule 2a into the author UI as an inline checklist.
5. A grader prompt v2 is still not indicated. The prompt has never been the
   limiting factor in any measurement taken.
