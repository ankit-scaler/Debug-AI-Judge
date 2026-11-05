import { executeTests } from '@/src/grading/execute-tests';
import { grade, mergeFiles, type GradeOutcome } from '@/src/grading/grade';
import { validateSubmission } from '@/src/grading/validate-submission';
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
      /** True when `scored` is false specifically because this learner gave up on this question. */
      gaveUp: boolean;
      criteria: { id: string; description: string; passed: boolean; evidence: string }[];
    }
  | {
      /** gradingMode: 'tests' -- real executed test assertions, not an LLM rubric. */
      status: 'tests_ran';
      passed: boolean;
      scored: boolean;
      gaveUp: boolean;
      tests: { name: string; passed: boolean; error: string | null }[];
    }
  | { status: 'invalid_submission'; errors: string[] }
  | { status: 'build_failed'; errors: { file: string; line: number; column: number; text: string }[] }
  | { status: 'grading_unavailable'; message: string }
  | { status: 'system_error'; message: string }
  | { status: 'timed_out'; message: string };

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

  if (loaded.meta.gradingMode === 'tests') {
    const validation = validateSubmission(submitted, loaded.questionFiles);
    if (!validation.ok) {
      return Response.json(
        { status: 'invalid_submission', errors: validation.errors } satisfies SubmitResponse,
        { status: 400 },
      );
    }

    const merged = mergeFiles(loaded.questionFiles, submitted);

    if (!loaded.meta.testEntry) {
      // An authoring mistake (gradingMode: 'tests' with no testEntry set),
      // not something a learner's submission can cause -- never blame it on
      // their code.
      console.error(`[submit] "${slug}" has gradingMode: 'tests' but no testEntry set`);
      return Response.json({
        status: 'system_error',
        message: 'Grading failed for a technical reason. Your code is safe — try again.',
      } satisfies SubmitResponse);
    }

    // No separate buildCheck() pre-pass here, unlike the LLM path: for
    // 'tests' mode, executeTests() below already runs its own esbuild build
    // of the *test* bundle (which, via the mock-handler interceptor, reaches
    // every editable file this question has -- not just whatever the app
    // entry's own import graph happens to reach) and fails fast on a
    // compile error before ever touching jsdom/vm. A prior version here
    // build-checked only loaded.meta.entry (the app entry), which missed
    // server-sim/cartHandlers.js and server-sim/db.js entirely -- they are
    // wired in dynamically by the interceptor, not statically imported by
    // src/App.jsx.
    //
    // 20s, not the (already-raised) 15s default: this is the production
    // path, and a suite that renders real components has little margin to
    // spare on a loaded server.
    //
    // Unlike grade() (the LLM path, which catches its own risky call and
    // returns a typed system_error), executeTests() had no such guard here
    // -- confirmed live: a missing-file crash inside it became an unhandled
    // exception, which Vercel turned into a bare empty-bodied 500 the
    // client's response.json() then failed to parse ("Unexpected end of
    // JSON input"). The learner's code was never at fault; nothing here
    // should ever reach them as anything but a clean, parseable JSON error.
    let executed;
    try {
      executed = await executeTests(merged, loaded.meta.testEntry, loaded.meta.handlersPath, 20000);
    } catch (err) {
      console.error(`[submit] executeTests threw for "${slug}": ${(err as Error).message}`);
      return Response.json({
        status: 'system_error',
        message: 'Grading failed for a technical reason. Your code is safe — try again.',
      } satisfies SubmitResponse);
    }

    if (executed.status === 'build_failed') {
      return Response.json(
        { status: 'build_failed', errors: executed.errors } satisfies SubmitResponse,
      );
    }
    if (executed.status === 'timed_out') {
      return Response.json({
        status: 'timed_out',
        message:
          'The tests did not finish in time. If your change added a loop or an await that ' +
          'never resolves, that is almost always why.',
      } satisfies SubmitResponse);
    }

    const passed = executed.tests.length > 0 && executed.tests.every((t) => t.passed);
    // Same anti-cheat rule as LLM-graded questions (grade.ts): a learner who
    // viewed the solution before passing never scores, on any grading mode.
    const hasGivenUp = await deps.gaveUp.has(deps.userId, loaded.meta.id);
    const scored =
      passed && !hasGivenUp ? await deps.firstPass.claim(deps.userId, loaded.meta.id) : false;

    return Response.json({
      status: 'tests_ran',
      passed,
      scored,
      gaveUp: hasGivenUp,
      tests: executed.tests,
    } satisfies SubmitResponse);
  }

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
      gaveUp: outcome.gaveUp,
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
