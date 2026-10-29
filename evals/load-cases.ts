import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readDirFiles } from '../src/files/read-dir-files';
import type { QuestionFile, RubricCriterion, SubmittedFile, Visibility } from '../src/types';

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
