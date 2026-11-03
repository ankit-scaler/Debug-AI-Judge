import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { QuestionMeta } from './load-question';

const QUESTIONS_ROOT = join(process.cwd(), 'questions');

/** What a browser is allowed to see for a question it has not opened yet. */
export interface QuestionSummary {
  slug: string;
  title: string;
  company: string;
  difficulty: string;
  tags: string[];
  scenario: string;
  timeLimitSec: number;
}

/**
 * Lists every question under `questions/`, sorted by slug.
 *
 * Reads only `question.json` per question (never the files or the reference
 * fix) and returns an allow-list of fields, same approach as
 * `toLearnerQuestion` in load-question.ts: no rubric, no entry/handlersPath,
 * no symptom. Adding a field to QuestionMeta later cannot leak here by being
 * forgotten.
 *
 * A directory under `questions/` with no `question.json` (reference material
 * someone dropped in, a half-authored question, a stray `.DS_Store` folder)
 * is skipped, not a crash -- this listing is read on every homepage load.
 */
export async function listQuestions(): Promise<QuestionSummary[]> {
  const entries = await readdir(QUESTIONS_ROOT, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const summaries = await Promise.all(
    slugs.map(async (slug) => {
      let meta: QuestionMeta;
      try {
        meta = JSON.parse(
          await readFile(join(QUESTIONS_ROOT, slug, 'question.json'), 'utf8'),
        ) as QuestionMeta;
      } catch {
        return null;
      }
      const summary: QuestionSummary = {
        slug: meta.slug,
        title: meta.title,
        company: meta.company,
        difficulty: meta.difficulty,
        tags: meta.tags,
        scenario: meta.scenario,
        timeLimitSec: meta.timeLimitSec,
      };
      return summary;
    }),
  );

  return summaries.filter((s): s is QuestionSummary => s !== null);
}
