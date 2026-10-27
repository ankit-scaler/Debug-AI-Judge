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

  const results: CaseResult[] = [];

  for (const c of cases) {
    let costUsd = 0;
    let latencyMs = 0;
    let cachedInputTokens = 0;

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

    const label =
      outcome.status === 'graded'
        ? outcome.verdict.passed === c.expected.passed
          ? 'ok'
          : 'MISMATCH'
        : outcome.status.toUpperCase();
    console.log(`${label.padEnd(10)} ${c.caseId}`);
  }

  const report = scoreRun(results);
  console.table(report);

  await mkdir(join(process.cwd(), 'evals', 'reports'), { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  await writeFile(
    join(process.cwd(), 'evals', 'reports', `${prompt.version}-${stamp}.json`),
    JSON.stringify({ promptVersion: prompt.version, report, results }, null, 2),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
