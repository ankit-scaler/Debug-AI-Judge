import type { Verdict } from '../src/types.js';

/** One grading of one case. The same case is graded `repeats` times per run. */
export interface CaseResult {
  caseId: string;
  repeat: number;
  expected: { passed: boolean; criteria: Record<string, boolean> };
  actual: Verdict | null;
  costUsd: number;
  latencyMs: number;
  cachedInputTokens: number;
}

export interface EvalReport {
  /** Distinct cases. */
  cases: number;
  /** Total gradings performed, i.e. cases x repeats. */
  runs: number;
  /** Minimum repeats observed across cases. 1 means stability is not measurable. */
  repeats: number;
  errored: number;

  /** Accuracy over every individual grading. */
  verdictAccuracy: number;
  /** Accuracy of each case's modal verdict. Undecided cases are excluded. */
  majorityVerdictAccuracy: number;
  falsePassRate: number;
  falseFailRate: number;
  criterionAgreement: number;

  /** Cases whose verdict was not identical across repeats. */
  unstableCases: number;
  verdictFlipRate: number;
  /** Cases with an even split, so no modal verdict exists. */
  undecidedCases: number;
  /** Fraction of (case, criterion) pairs that answered differently across repeats. */
  criterionFlipRate: number;
  /** "<caseId> <criterionId>" for each pair that flipped. */
  unstableCriteria: string[];

  totalCostUsd: number;
  p50LatencyMs: number;
  cacheHitRate: number;

  /** No case errored, and there was at least one case. */
  trustworthy: boolean;
  /** At least two repeats per case, so flip rates mean something. */
  stabilityMeasurable: boolean;
  /** Measurable and nothing flipped. */
  stable: boolean;
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function scoreRun(results: CaseResult[]): EvalReport {
  const graded = results.filter((r) => r.actual !== null);

  const byCase = new Map<string, CaseResult[]>();
  for (const r of results) {
    const list = byCase.get(r.caseId) ?? [];
    list.push(r);
    byCase.set(r.caseId, list);
  }

  const shouldPass = graded.filter((r) => r.expected.passed);
  const shouldFail = graded.filter((r) => !r.expected.passed);

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

  let unstableCases = 0;
  let undecidedCases = 0;
  let majorityCorrect = 0;
  let majorityDecided = 0;
  let criterionPairs = 0;
  let criterionFlips = 0;
  const unstableCriteria: string[] = [];

  for (const [caseId, runs] of byCase) {
    const gradedRuns = runs.filter((r) => r.actual !== null);
    if (gradedRuns.length === 0) continue;

    const verdicts = gradedRuns.map((r) => r.actual!.passed);
    const trues = verdicts.filter(Boolean).length;
    const falses = verdicts.length - trues;
    if (new Set(verdicts).size > 1) unstableCases += 1;

    if (trues === falses) {
      undecidedCases += 1;
    } else {
      majorityDecided += 1;
      if (trues > falses === gradedRuns[0]!.expected.passed) majorityCorrect += 1;
    }

    // Per-criterion stability across this case's repeats.
    const answers = new Map<string, boolean[]>();
    for (const r of gradedRuns) {
      for (const cv of r.actual!.criteria) {
        const list = answers.get(cv.id) ?? [];
        list.push(cv.passed);
        answers.set(cv.id, list);
      }
    }
    for (const [criterionId, list] of answers) {
      criterionPairs += 1;
      if (new Set(list).size > 1) {
        criterionFlips += 1;
        unstableCriteria.push(`${caseId} ${criterionId}`);
      }
    }
  }

  const repeats =
    byCase.size === 0 ? 0 : Math.min(...[...byCase.values()].map((runs) => runs.length));
  const stabilityMeasurable = repeats >= 2;
  const latencies = graded.map((r) => r.latencyMs).sort((a, b) => a - b);

  return {
    cases: byCase.size,
    runs: results.length,
    repeats,
    errored: results.length - graded.length,

    verdictAccuracy: ratio(
      graded.filter((r) => r.actual!.passed === r.expected.passed).length,
      graded.length,
    ),
    majorityVerdictAccuracy: ratio(majorityCorrect, majorityDecided),
    falsePassRate: ratio(shouldFail.filter((r) => r.actual!.passed).length, shouldFail.length),
    falseFailRate: ratio(shouldPass.filter((r) => !r.actual!.passed).length, shouldPass.length),
    criterionAgreement: ratio(criterionHits, criterionTotal),

    unstableCases,
    verdictFlipRate: ratio(unstableCases, byCase.size),
    undecidedCases,
    criterionFlipRate: ratio(criterionFlips, criterionPairs),
    unstableCriteria: unstableCriteria.sort(),

    totalCostUsd: results.reduce((sum, r) => sum + r.costUsd, 0),
    p50LatencyMs: latencies.length === 0 ? 0 : latencies[Math.floor(latencies.length / 2)]!,
    cacheHitRate: ratio(graded.filter((r) => r.cachedInputTokens > 0).length, graded.length),

    trustworthy: results.length > 0 && graded.length === results.length,
    stabilityMeasurable,
    stable: stabilityMeasurable && unstableCases === 0 && criterionFlips === 0,
  };
}
