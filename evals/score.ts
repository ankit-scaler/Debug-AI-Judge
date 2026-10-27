import type { Verdict } from '../src/types.js';

export interface CaseResult {
  caseId: string;
  expected: { passed: boolean; criteria: Record<string, boolean> };
  actual: Verdict | null;
  costUsd: number;
  latencyMs: number;
  cachedInputTokens: number;
}

export interface EvalReport {
  cases: number;
  errored: number;
  verdictAccuracy: number;
  falsePassRate: number;
  falseFailRate: number;
  criterionAgreement: number;
  totalCostUsd: number;
  p50LatencyMs: number;
  cacheHitRate: number;
  /** False when any case errored, or when there are no cases. An accuracy figure
   *  computed over a subset is not a baseline. */
  trustworthy: boolean;
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function scoreRun(results: CaseResult[]): EvalReport {
  const graded = results.filter((r) => r.actual !== null);
  const shouldPass = graded.filter((r) => r.expected.passed);
  const shouldFail = graded.filter((r) => !r.expected.passed);

  const correct = graded.filter((r) => r.actual!.passed === r.expected.passed).length;
  const falsePasses = shouldFail.filter((r) => r.actual!.passed).length;
  const falseFails = shouldPass.filter((r) => !r.actual!.passed).length;

  let criterionHits = 0;
  let criterionTotal = 0;
  for (const r of graded) {
    for (const cv of r.actual!.criteria) {
      const expected = r.expected.criteria[cv.id];
      if (expected === undefined) continue;
      criterionTotal += 1;
      if (expected === cv.passed) criterionHits += 1;
    }
  }

  const latencies = graded.map((r) => r.latencyMs).sort((a, b) => a - b);

  return {
    cases: results.length,
    errored: results.length - graded.length,
    verdictAccuracy: ratio(correct, graded.length),
    falsePassRate: ratio(falsePasses, shouldFail.length),
    falseFailRate: ratio(falseFails, shouldPass.length),
    criterionAgreement: ratio(criterionHits, criterionTotal),
    totalCostUsd: results.reduce((sum, r) => sum + r.costUsd, 0),
    p50LatencyMs: latencies.length === 0 ? 0 : latencies[Math.floor(latencies.length / 2)]!,
    cacheHitRate: ratio(graded.filter((r) => r.cachedInputTokens > 0).length, graded.length),
    trustworthy: results.length > 0 && graded.length === results.length,
  };
}
