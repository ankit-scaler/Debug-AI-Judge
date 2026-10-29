import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readDirFiles } from '../files/read-dir-files';
import type { QuestionFile, RubricCriterion, SubmittedFile, Visibility } from '../types';

export interface QuestionMeta {
  id: string;
  slug: string;
  version: number;
  title: string;
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  timeLimitSec: number;
  entry: string;
  handlersPath?: string;
  scenario: string;
  symptom: string;
  visibility: Record<string, Visibility>;
  rubric: RubricCriterion[];
  /** Ordered least to most revealing. Never sent in the initial learner payload -- see toLearnerQuestion. */
  hints: string[];
}

export interface LoadedQuestion {
  meta: QuestionMeta;
  /** Every file, including hidden ones. Server-side only. */
  questionFiles: QuestionFile[];
  /** The reference fix. Server-side only, never sent to a browser. */
  referenceFix: SubmittedFile[];
}

const QUESTIONS_ROOT = join(process.cwd(), 'questions');
const SLUG_RE = /^[a-z0-9-]+$/;

export async function loadQuestion(slug: string): Promise<LoadedQuestion> {
  if (!SLUG_RE.test(slug)) throw new Error(`Invalid question slug "${slug}"`);

  const dir = join(QUESTIONS_ROOT, slug);
  const meta = JSON.parse(await readFile(join(dir, 'question.json'), 'utf8')) as QuestionMeta;

  const raw = await readDirFiles(join(dir, 'files'));
  const questionFiles: QuestionFile[] = raw.map((f) => ({
    ...f,
    // Anything the author did not classify is read-only, never editable. A typo
    // in the visibility map must not hand a learner write access.
    visibility: meta.visibility[f.path] ?? 'readonly',
  }));

  return {
    meta,
    questionFiles,
    referenceFix: await readDirFiles(join(dir, 'reference')),
  };
}

/** What a browser is allowed to see. */
export interface LearnerQuestion {
  slug: string;
  version: number;
  title: string;
  company: string;
  difficulty: string;
  tags: string[];
  timeLimitSec: number;
  entry: string;
  handlersPath?: string;
  scenario: string;
  symptom: string;
  files: QuestionFile[];
}

/**
 * Strips a loaded question down to what a learner may receive.
 *
 * Drops the rubric (it is the answer key for grading), the reference fix (it is
 * the answer), and every hidden file. Built as an allow-list of fields rather
 * than a delete-list, so a field added to QuestionMeta later cannot leak by
 * being forgotten here.
 */
export function toLearnerQuestion(loaded: LoadedQuestion): LearnerQuestion {
  const { meta } = loaded;
  return {
    slug: meta.slug,
    version: meta.version,
    title: meta.title,
    company: meta.company,
    difficulty: meta.difficulty,
    tags: meta.tags,
    timeLimitSec: meta.timeLimitSec,
    entry: meta.entry,
    handlersPath: meta.handlersPath,
    scenario: meta.scenario,
    symptom: meta.symptom,
    files: loaded.questionFiles.filter((f) => f.visibility !== 'hidden'),
  };
}
