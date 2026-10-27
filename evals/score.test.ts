import { expect, test } from 'vitest';
import { scoreRun } from './score.js';

const c = (
  caseId: string,
  expectedPassed: boolean,
  actualPassed: boolean | null,
) => ({
  caseId,
  expected: { passed: expectedPassed, criteria: { c1: expectedPassed } },
  actual: actualPassed === null ? null : { passed: actualPassed, criteria: [{ id: 'c1', passed: actualPassed, evidence: '' }] },
  costUsd: 0.01,
  latencyMs: 1000,
  cachedInputTokens: 2000,
});

test('reports perfect accuracy when every verdict matches', () => {
  const r = scoreRun([c('a', true, true), c('b', false, false)]);
  expect(r.verdictAccuracy).toBe(1);
  expect(r.falsePassRate).toBe(0);
  expect(r.falseFailRate).toBe(0);
});

test('counts a false pass separately from a false fail', () => {
  const r = scoreRun([
    c('a', false, true),
    c('b', true, false),
    c('c', true, true),
    c('d', false, false),
  ]);
  expect(r.falsePassRate).toBe(0.5);
  expect(r.falseFailRate).toBe(0.5);
  expect(r.verdictAccuracy).toBe(0.5);
});

test('counts errored cases and excludes them from accuracy', () => {
  const r = scoreRun([c('a', true, true), c('b', true, null)]);
  expect(r.errored).toBe(1);
  expect(r.cases).toBe(2);
  expect(r.verdictAccuracy).toBe(1);
});

test('sums cost and reports median latency', () => {
  const r = scoreRun([c('a', true, true), c('b', true, true), c('c', true, true)]);
  expect(r.totalCostUsd).toBeCloseTo(0.03, 8);
  expect(r.p50LatencyMs).toBe(1000);
});

test('reports the cache hit rate so a short prefix is visible', () => {
  const results = [c('a', true, true), { ...c('b', true, true), cachedInputTokens: 0 }];
  expect(scoreRun(results).cacheHitRate).toBe(0.5);
});

test('scores an empty run without dividing by zero', () => {
  const r = scoreRun([]);
  expect(r.cases).toBe(0);
  expect(r.verdictAccuracy).toBe(0);
  expect(r.falsePassRate).toBe(0);
});

// I9: an accuracy figure computed over 3 of 20 cases is a trap with money behind it.
test('marks a run untrustworthy when any case errored', () => {
  expect(scoreRun([c('a', true, true), c('b', true, null)]).trustworthy).toBe(false);
});

test('marks a run trustworthy only when every case was graded', () => {
  expect(scoreRun([c('a', true, true), c('b', false, false)]).trustworthy).toBe(true);
});

test('an empty run is not trustworthy', () => {
  expect(scoreRun([]).trustworthy).toBe(false);
});
