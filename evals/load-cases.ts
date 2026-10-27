import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import type { QuestionFile, RubricCriterion, SubmittedFile, Visibility } from '../src/types.js';

export interface EvalCase {
  caseId: string;
  questionId: string;
  questionVersion: number;
  entry: string;
  scenario: string;
  symptom: string;
  rubric: RubricCriterion[];
  questionFiles: QuestionFile[];
  referenceFix: SubmittedFile[];
  submitted: SubmittedFile[];
  expected: { passed: boolean; criteria: Record<string, boolean> };
}

async function readDirFiles(dir: string): Promise<SubmittedFile[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const out: SubmittedFile[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const absolute = join(entry.parentPath, entry.name);
    // Case paths are always posix-style inside a question, whatever the host OS.
    const rel = relative(dir, absolute).split(sep).join('/');
    out.push({ path: rel, content: await readFile(absolute, 'utf8') });
  }
  return out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

export async function loadCases(root: string): Promise<EvalCase[]> {
  const ids = (await readdir(root, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const cases: EvalCase[] = [];
  for (const caseId of ids) {
    const dir = join(root, caseId);
    const meta = JSON.parse(await readFile(join(dir, 'case.json'), 'utf8'));

    const rubricIds = new Set<string>(meta.rubric.map((c: RubricCriterion) => c.id));
    for (const id of Object.keys(meta.expected.criteria)) {
      if (!rubricIds.has(id)) {
        throw new Error(`Case "${caseId}": expected criterion "${id}" is not in the rubric`);
      }
    }
    for (const id of rubricIds) {
      if (!(id in meta.expected.criteria)) {
        throw new Error(`Case "${caseId}": no expectation for rubric criterion "${id}"`);
      }
    }
    const allExpectedPass = Object.values(meta.expected.criteria).every(Boolean);
    if (allExpectedPass !== meta.expected.passed) {
      throw new Error(
        `Case "${caseId}": expected.passed (${meta.expected.passed}) contradicts expected.criteria`,
      );
    }

    const questionRaw = await readDirFiles(join(dir, 'question'));
    cases.push({
      caseId,
      questionId: meta.questionId,
      questionVersion: meta.questionVersion,
      entry: meta.entry,
      scenario: meta.scenario,
      symptom: meta.symptom,
      rubric: meta.rubric,
      questionFiles: questionRaw.map((f) => ({
        ...f,
        visibility: (meta.visibility[f.path] ?? 'readonly') as Visibility,
      })),
      referenceFix: await readDirFiles(join(dir, 'reference')),
      submitted: await readDirFiles(join(dir, 'attempt')),
      expected: meta.expected,
    });
  }
  return cases;
}
