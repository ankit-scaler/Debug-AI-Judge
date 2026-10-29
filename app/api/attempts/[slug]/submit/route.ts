import { grade, type GradeOutcome } from '@/src/grading/grade';
import { loadQuestion } from '@/src/questions/load-question';
import { localGradeDeps, localSpend } from '@/src/server/local-deps';
import type { SubmittedFile } from '@/src/types';

/** What the browser is allowed to learn about a submission. */
type SubmitResponse =
  | {
      status: 'graded';
      passed: boolean;
      cacheHit: boolean;
      scored: boolean;
      criteria: { id: string; description: string; passed: boolean; evidence: string }[];
    }
  | { status: 'invalid_submission'; errors: string[] }
  | { status: 'build_failed'; errors: { file: string; line: number; column: number; text: string }[] }
  | { status: 'grading_unavailable'; message: string }
  | { status: 'system_error'; message: string };

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  let submitted: SubmittedFile[];
  try {
    const body = (await request.json()) as { files?: unknown };
    if (!Array.isArray(body.files)) throw new Error('files must be an array');
    submitted = body.files as SubmittedFile[];
  } catch {
    return Response.json(
      { status: 'invalid_submission', errors: ['Malformed request body'] } satisfies SubmitResponse,
      { status: 400 },
    );
  }

  const loaded = await loadQuestion(slug);
  const deps = await localGradeDeps();

  const outcome: GradeOutcome = await grade(
    {
      questionId: loaded.meta.id,
      questionVersion: loaded.meta.version,
      entry: loaded.meta.entry,
      scenario: loaded.meta.scenario,
      symptom: loaded.meta.symptom,
      rubric: loaded.meta.rubric,
      referenceFix: loaded.referenceFix,
      questionFiles: loaded.questionFiles,
      submitted,
    },
    deps,
  );

  if (outcome.status === 'graded') {
    const byId = new Map(loaded.meta.rubric.map((c) => [c.id, c.description]));
    const response: SubmitResponse = {
      status: 'graded',
      passed: outcome.verdict.passed,
      cacheHit: outcome.cacheHit,
      scored: outcome.scored,
      // Criterion text is revealed only after a submission, never in the question
      // payload. Deliberate: the result card is useless without it.
      criteria: outcome.verdict.criteria.map((c) => ({
        id: c.id,
        description: byId.get(c.id) ?? c.id,
        passed: c.passed,
        evidence: c.evidence,
      })),
    };
    return Response.json(response);
  }

  if (outcome.status === 'system_error') {
    // The reason can carry raw provider output. Log it, do not ship it.
    console.error(`[submit] system error on "${slug}": ${outcome.reason}`);
    return Response.json({
      status: 'system_error',
      message: 'Grading failed for a technical reason. Your code is safe — try again.',
    } satisfies SubmitResponse);
  }

  if (outcome.status === 'grading_unavailable') {
    const spend = localSpend();
    console.error(
      `[submit] spend ceiling reached: $${spend.spentUsd.toFixed(4)} of $${spend.ceilingUsd}`,
    );
    return Response.json({
      status: 'grading_unavailable',
      message:
        'Grading is temporarily unavailable because the spend limit was reached. ' +
        'Your code is safe. Raise AI_MONTHLY_CEILING_USD to continue.',
    } satisfies SubmitResponse);
  }

  return Response.json(outcome satisfies SubmitResponse);
}
