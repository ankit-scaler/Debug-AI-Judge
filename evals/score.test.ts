import { expect, test } from 'vitest';
import { scoreRun, type CaseResult } from './score.js';

/** One grading of one case. `criteria` maps criterion id to the verdict given. */
function run(
  caseId: string,
  repeat: number,
  expected: Record<string, boolean>,
  actual: Record<string, boolean> | null,
  over: Partial<CaseResult> = {},
): CaseResult {
  return {
    caseId,
    repeat,
    expected: { passed: Object.values(expected).every(Boolean), criteria: expected },
    actual:
      actual === null
        ? null
        : {
            passed: Object.values(actual).every(Boolean),
            criteria: Object.entries(actual).map(([id, passed]) => ({ id, passed, evidence: 'x' })),
          },
    costUsd: 0.004,
    latencyMs: 1200,
    cachedInputTokens: 2000,
    ...over,
  };
}

test('counts distinct cases and total gradings separately', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, { c1: true }),
    run('b', 0, { c1: false }, { c1: false }),
    run('b', 1, { c1: false }, { c1: false }),
  ]);
  expect(r.cases).toBe(2);
  expect(r.runs).toBe(4);
  expect(r.repeats).toBe(2);
});

test('a fully stable run reports zero flip rates and is stable', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, { c1: true }),
    run('a', 2, { c1: true }, { c1: true }),
  ]);
  expect(r.verdictFlipRate).toBe(0);
  expect(r.criterionFlipRate).toBe(0);
  expect(r.unstableCriteria).toEqual([]);
  expect(r.stable).toBe(true);
});

// The finding this whole module exists for: the grader can answer differently on
// identical input, so a single run cannot separate a real change from variance.
test('detects a criterion that answered differently across repeats', () => {
  const r = scoreRun([
    run('a', 0, { c1: true, c2: true }, { c1: true, c2: true }),
    run('a', 1, { c1: true, c2: true }, { c1: true, c2: false }),
    run('a', 2, { c1: true, c2: true }, { c1: true, c2: true }),
  ]);
  expect(r.criterionFlipRate).toBeCloseTo(0.5, 10);
  expect(r.unstableCriteria).toEqual(['a c2']);
  expect(r.stable).toBe(false);
});

test('detects a case whose overall verdict differed across repeats', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, { c1: false }),
    run('a', 2, { c1: true }, { c1: true }),
  ]);
  expect(r.unstableCases).toBe(1);
  expect(r.verdictFlipRate).toBe(1);
});

test('majority verdict takes the modal answer per case, not the first', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: false }),
    run('a', 1, { c1: true }, { c1: true }),
    run('a', 2, { c1: true }, { c1: true }),
  ]);
  expect(r.majorityVerdictAccuracy).toBe(1);
  // Per-run accuracy still counts the one wrong answer.
  expect(r.verdictAccuracy).toBeCloseTo(2 / 3, 10);
});

test('an even split leaves the majority undecided and the case unstable', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, { c1: false }),
  ]);
  expect(r.undecidedCases).toBe(1);
  expect(r.unstableCases).toBe(1);
});

test('false passes and false fails are counted over every grading', () => {
  const r = scoreRun([
    run('cheat', 0, { c1: false }, { c1: true }),
    run('cheat', 1, { c1: false }, { c1: false }),
    run('good', 0, { c1: true }, { c1: false }),
    run('good', 1, { c1: true }, { c1: true }),
  ]);
  expect(r.falsePassRate).toBeCloseTo(0.5, 10);
  expect(r.falseFailRate).toBeCloseTo(0.5, 10);
});

test('errored gradings are counted and excluded from accuracy', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, null),
  ]);
  expect(r.errored).toBe(1);
  expect(r.runs).toBe(2);
  expect(r.verdictAccuracy).toBe(1);
  expect(r.trustworthy).toBe(false);
});

test('a run with one repeat per case cannot claim stability', () => {
  const r = scoreRun([run('a', 0, { c1: true }, { c1: true })]);
  expect(r.repeats).toBe(1);
  expect(r.stable).toBe(false);
  expect(r.stabilityMeasurable).toBe(false);
});

test('scores an empty run without dividing by zero', () => {
  const r = scoreRun([]);
  expect(r.cases).toBe(0);
  expect(r.runs).toBe(0);
  expect(r.verdictAccuracy).toBe(0);
  expect(r.trustworthy).toBe(false);
  expect(r.stable).toBe(false);
});

test('sums cost across every grading and reports median latency', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, { c1: true }),
    run('a', 2, { c1: true }, { c1: true }),
  ]);
  expect(r.totalCostUsd).toBeCloseTo(0.012, 8);
  expect(r.p50LatencyMs).toBe(1200);
});

test('reports the cache hit rate over gradings', () => {
  const r = scoreRun([
    run('a', 0, { c1: true }, { c1: true }),
    run('a', 1, { c1: true }, { c1: true }, { cachedInputTokens: 0 }),
  ]);
  expect(r.cacheHitRate).toBe(0.5);
});
