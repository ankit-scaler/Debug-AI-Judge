import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { grade } from '../src/grading/grade.js';
import { loadPrompt } from '../src/grading/prompt-loader.js';
import { callModel } from '../src/grading/openrouter.js';
import { loadCases } from './load-cases.js';
import { scoreRun, type CaseResult } from './score.js';

const PROMPT_VERSION = process.env.GRADER_PROMPT_VERSION ?? 'v1';

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  const prompt = await loadPrompt('grader', PROMPT_VERSION);
  const cases = await loadCases(join(process.cwd(), 'evals', 'cases'));
  if (cases.length === 0) throw new Error('No eval cases found under evals/cases');

  const reportDir = join(process.cwd(), 'evals', 'reports');
  await mkdir(reportDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = join(reportDir, `${prompt.version}-${stamp}.json`);

  const results: CaseResult[] = [];

  // Every case costs real money, so the report is rewritten after each one. A
  // crash on case 19 must not discard eighteen cases of paid results.
  const flush = async () =>
    writeFile(
      reportPath,
      JSON.stringify(
        { promptVersion: prompt.version, report: scoreRun(results), results },
        null,
        2,
      ),
    );

  for (const c of cases) {
    let costUsd = 0;
    let latencyMs = 0;
    let cachedInputTokens = 0;
    const warnings: string[] = [];

    const outcome = await grade(
      { ...c },
      {
        // No caching in the eval: a cached verdict would measure the cache, not the model.
        cache: { get: async () => null, put: async () => {} },
        spend: {
          monthToDateUsd: async () => 0,
          ceilingUsd: async () => Number.POSITIVE_INFINITY,
          record: async (e) => {
            costUsd = e.costUsd;
            latencyMs = e.latencyMs;
            cachedInputTokens = e.usage.cachedInputTokens;
            if (e.cacheWarning) warnings.push(e.cacheWarning);
            warnings.push(...e.costWarnings);
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
      expected: c.expected,
      actual: outcome.status === 'graded' ? outcome.verdict : null,
      costUsd,
      latencyMs,
      cachedInputTokens,
    });
    await flush();

    const label =
      outcome.status === 'graded'
        ? outcome.verdict.passed === c.expected.passed
          ? 'ok'
          : 'MISMATCH'
        : outcome.status.toUpperCase();
    const detail = outcome.status === 'system_error' ? ` — ${outcome.reason}` : '';
    console.log(`${label.padEnd(20)} ${c.caseId}${detail}`);
    for (const w of warnings) console.log(`${' '.repeat(20)} warning: ${w}`);
  }

  const report = scoreRun(results);
  console.table(report);
  console.log(`\nreport: ${reportPath}`);

  if (!report.trustworthy) {
    console.error(
      `\nUNTRUSTWORTHY RUN: ${report.errored} of ${report.cases} cases errored.\n` +
        `Accuracy above is computed only over the cases that were graded, so it is not a baseline.\n` +
        `Fix the errored cases and re-run before recording any number.`,
    );
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
