import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { grade } from '../src/grading/grade';
import { loadPrompt } from '../src/grading/prompt-loader';
import { callModel } from '../src/grading/openrouter';
import { loadCases } from './load-cases';
import { scoreRun, type CaseResult } from './score';

const PROMPT_VERSION = process.env.GRADER_PROMPT_VERSION ?? 'v1';
/**
 * The grader is non-deterministic: measured 2026-10-27, roughly 4 of 76 criteria
 * answered differently between identical runs. One grading per case cannot tell a
 * real change from variance, so the default is three.
 */
const REPEATS = Number(process.env.EVAL_REPEATS ?? 3);

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');
  if (!Number.isInteger(REPEATS) || REPEATS < 1) {
    throw new Error(`EVAL_REPEATS must be a positive integer, got "${process.env.EVAL_REPEATS}"`);
  }

  const prompt = await loadPrompt('grader', PROMPT_VERSION);
  const cases = await loadCases(join(process.cwd(), 'evals', 'cases'));
  if (cases.length === 0) throw new Error('No eval cases found under evals/cases');

  const reportDir = join(process.cwd(), 'evals', 'reports');
  await mkdir(reportDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = join(reportDir, `${prompt.version}-x${REPEATS}-${stamp}.json`);

  const results: CaseResult[] = [];

  // Every grading costs real money, so the report is rewritten after each one.
  const flush = async () =>
    writeFile(
      reportPath,
      JSON.stringify(
        {
          promptVersion: prompt.version,
          repeats: REPEATS,
          report: scoreRun(results),
          results,
        },
        null,
        2,
      ),
    );

  console.log(`${cases.length} cases x ${REPEATS} repeats = ${cases.length * REPEATS} gradings\n`);

  for (const c of cases) {
    const marks: string[] = [];
    const warnings = new Set<string>();

    for (let repeat = 0; repeat < REPEATS; repeat++) {
      let costUsd = 0;
      let latencyMs = 0;
      let cachedInputTokens = 0;

      const outcome = await grade(
        { ...c },
        {
          // No verdict cache in the eval: a cached verdict would measure the
          // cache, and would hide exactly the variance we are here to measure.
          cache: { get: async () => null, put: async () => {} },
          spend: {
            monthToDateUsd: async () => 0,
            ceilingUsd: async () => Number.POSITIVE_INFINITY,
            record: async (e) => {
              costUsd = e.costUsd;
              latencyMs = e.latencyMs;
              cachedInputTokens = e.usage.cachedInputTokens;
              if (e.cacheWarning) warnings.add(e.cacheWarning);
              for (const w of e.costWarnings) warnings.add(w);
            },
          },
          firstPass: { claim: async () => false },
          callModel,
          promptText: prompt.text,
          promptVersion: prompt.version,
          userId: 'eval',
          apiKey,
        },
      );

      results.push({
        caseId: c.caseId,
        repeat,
        expected: c.expected,
        actual: outcome.status === 'graded' ? outcome.verdict : null,
        costUsd,
        latencyMs,
        cachedInputTokens,
      });
      await flush();

      marks.push(
        outcome.status === 'graded' ? (outcome.verdict.passed ? 'P' : 'F') : '!',
      );
    }

    const expected = c.expected.passed ? 'P' : 'F';
    const unstable = new Set(marks).size > 1;
    const wrong = marks.some((m) => m !== '!' && m !== expected);
    const label = unstable ? 'UNSTABLE' : wrong ? 'MISMATCH' : 'ok';
    console.log(
      `${label.padEnd(10)} ${c.caseId.padEnd(26)} want ${expected}  got [${marks.join(' ')}]`,
    );
    for (const w of warnings) console.log(`${' '.repeat(10)} warning: ${w}`);
  }

  const report = scoreRun(results);
  console.table(report);
  console.log(`\nreport: ${reportPath}`);

  if (report.unstableCriteria.length > 0) {
    console.log(`\nCriteria that answered differently across repeats:`);
    for (const u of report.unstableCriteria) console.log(`  ${u}`);
  }

  const problems: string[] = [];
  if (!report.trustworthy) {
    problems.push(`${report.errored} of ${report.runs} gradings errored`);
  }
  if (!report.stabilityMeasurable) {
    problems.push(`only ${report.repeats} repeat per case: stability is not measurable`);
  }
  if (report.unstableCases > 0) {
    problems.push(
      `${report.unstableCases} of ${report.cases} cases changed verdict across repeats`,
    );
  }

  if (problems.length > 0) {
    console.error(
      `\nDO NOT TREAT THIS RUN AS A MEASUREMENT:\n` +
        problems.map((p) => `  - ${p}`).join('\n') +
        `\nA number from an unstable or incomplete run cannot be compared against another run.`,
    );
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
