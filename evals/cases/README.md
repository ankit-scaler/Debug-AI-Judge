# Eval cases

Each directory here is one **case**: a claim about what the correct verdict is for
one learner attempt at one question. The eval runner grades every case and
compares the grader's verdict against the claim.

A wrong case is worse than a missing one. Nothing downstream can catch it — the
case *is* the source of truth — so an incorrect expectation silently tunes the
grader toward the wrong behaviour. Every case's expectation must be reviewed by a
person before it is added.

## Layout

```
evals/cases/<case-id>/
  case.json      metadata, rubric, and the expected verdict
  question/      the question's files, as the learner first sees them
  reference/     the reference fix (a known-correct solution)
  attempt/       the learner's submitted files — what is being graded
```

File paths inside `question/`, `reference/` and `attempt/` are relative to those
directories and use forward slashes on every OS.

## case.json

| Field | Meaning |
|---|---|
| `questionId` | Stable id; scopes the verdict cache |
| `questionVersion` | Integer; bump when question content changes |
| `entry` | Entry file for the build gate, e.g. `src/App.jsx` |
| `scenario` | The story the learner reads |
| `symptom` | The failure as a user would report it |
| `visibility` | Map of question file path to `editable` \| `readonly` \| `hidden`. Unlisted files default to `readonly` |
| `rubric` | Array of `{ id, kind, description }`; `kind` is one of `root_cause`, `behaviour`, `anti_shortcut`, `no_regression` |
| `expected.criteria` | Map of criterion id to the correct pass/fail |
| `expected.passed` | The correct overall verdict |

The loader rejects a case where `expected.criteria` omits a rubric id, names an id
that is not in the rubric, or disagrees with `expected.passed`. Those are not
judgement calls — they are contradictions, and they fail loudly at load time
rather than quietly skewing a score.

## What the set must cover

A set made only of "correct fix passes, broken code fails" measures almost
nothing. The cases that earn their place are the ones where a plausible grader
gets it wrong: a valid fix written differently from the reference, a fix that
makes the symptom vanish by hardcoding the data, a fix that deletes the failing
call, a fix that regresses something else, and an attempt with an
instruction-shaped comment trying to talk the grader into a pass.
