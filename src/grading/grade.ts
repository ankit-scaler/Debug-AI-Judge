import { assembleGradingMessages } from './assemble-prompt';
import { buildCheck, type BuildError } from './build-gate';
import { GRADER_MODEL, priceUsage } from './cost';
import { submissionHash } from './hash';
import { callModel as defaultCallModel, ModelCallError } from './openrouter';
import { validateSubmission } from './validate-submission';
import { parseVerdict, verdictJsonSchema } from './verdict-schema';
import type { QuestionFile, RubricCriterion, SubmittedFile, Usage, Verdict } from '../types';

export interface UsageRecord {
  userId: string;
  questionId: string;
  feature: 'grade';
  model: string;
  promptVersion: string;
  usage: Usage;
  costUsd: number;
  latencyMs: number;
  cacheHit: boolean;
  /** Set when the assembled stable prefix looked too short to cache. */
  cacheWarning: string | null;
  /** Pricing anomalies, e.g. a divergence from the provider's own cost figure. */
  costWarnings: string[];
}

export interface GradeInput {
  questionId: string;
  questionVersion: number;
  entry: string;
  scenario: string;
  symptom: string;
  rubric: RubricCriterion[];
  referenceFix: SubmittedFile[];
  questionFiles: QuestionFile[];
  submitted: SubmittedFile[];
}

export interface GradeDeps {
  cache: { get(hash: string): Promise<Verdict | null>; put(hash: string, v: Verdict): Promise<void> };
  spend: {
    monthToDateUsd(): Promise<number>;
    ceilingUsd(): Promise<number>;
    record(e: UsageRecord): Promise<void>;
  };
  firstPass: { claim(userId: string, questionId: string): Promise<boolean> };
  callModel: typeof defaultCallModel;
  promptText: string;
  promptVersion: string;
  userId: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
}

export type GradeOutcome =
  | { status: 'graded'; verdict: Verdict; cacheHit: boolean; costUsd: number; scored: boolean }
  | { status: 'invalid_submission'; errors: string[] }
  | { status: 'build_failed'; errors: BuildError[] }
  | { status: 'grading_unavailable'; reason: 'spend_ceiling' }
  | { status: 'system_error'; reason: string };

export async function grade(input: GradeInput, deps: GradeDeps): Promise<GradeOutcome> {
  const validation = validateSubmission(input.submitted, input.questionFiles);
  if (!validation.ok) return { status: 'invalid_submission', errors: validation.errors };

  const hash = submissionHash(input.questionId, input.questionVersion, input.submitted);

  const cached = await deps.cache.get(hash);
  if (cached) {
    const scored = cached.passed
      ? await deps.firstPass.claim(deps.userId, input.questionId)
      : false;
    return { status: 'graded', verdict: cached, cacheHit: true, costUsd: 0, scored };
  }

  const merged = mergeFiles(input.questionFiles, input.submitted);
  const build = await buildCheck(merged, input.entry);
  if (!build.ok) return { status: 'build_failed', errors: build.errors };

  const [mtd, ceiling] = await Promise.all([deps.spend.monthToDateUsd(), deps.spend.ceilingUsd()]);
  if (mtd >= ceiling) return { status: 'grading_unavailable', reason: 'spend_ceiling' };

  const assembled = assembleGradingMessages({
    promptText: deps.promptText,
    scenario: input.scenario,
    symptom: input.symptom,
    rubric: input.rubric,
    referenceFix: input.referenceFix,
    submitted: input.submitted,
  });

  const record = async (
    usage: Parameters<typeof priceUsage>[1],
    latencyMs: number,
  ): Promise<number> => {
    const priced = priceUsage(GRADER_MODEL, usage);
    await deps.spend.record({
      userId: deps.userId,
      questionId: input.questionId,
      feature: 'grade',
      model: GRADER_MODEL,
      promptVersion: deps.promptVersion,
      usage,
      costUsd: priced.costUsd,
      latencyMs,
      cacheHit: false,
      cacheWarning: assembled.cacheWarning,
      costWarnings: priced.warnings,
    });
    return priced.costUsd;
  };

  let response;
  try {
    response = await deps.callModel(
      {
        model: GRADER_MODEL,
        messages: assembled.messages,
        schemaName: 'verdict',
        schema: verdictJsonSchema(input.rubric),
      },
      { fetch: deps.fetchImpl ?? fetch, apiKey: deps.apiKey ?? '' },
    );
  } catch (err) {
    // A 200 that was billed but unusable still has usage attached. Ledger it
    // before returning, or the spend ceiling silently drifts below reality.
    if (err instanceof ModelCallError && err.usage) {
      await record(err.usage, err.latencyMs ?? 0);
    }
    return { status: 'system_error', reason: `Model call failed: ${(err as Error).message}` };
  }

  const cost = await record(response.usage, response.latencyMs);

  const parsed = parseVerdict(response.raw, input.rubric);
  if (!parsed.ok) {
    return { status: 'system_error', reason: `Invalid verdict: ${parsed.reason}` };
  }

  await deps.cache.put(hash, parsed.verdict);
  const scored = parsed.verdict.passed
    ? await deps.firstPass.claim(deps.userId, input.questionId)
    : false;

  return { status: 'graded', verdict: parsed.verdict, cacheHit: false, costUsd: cost, scored };
}

function mergeFiles(questionFiles: QuestionFile[], submitted: SubmittedFile[]): SubmittedFile[] {
  const bySubmitted = new Map(submitted.map((f) => [f.path, f.content]));
  return questionFiles.map((f) => ({
    path: f.path,
    content: bySubmitted.get(f.path) ?? f.content,
  }));
}
