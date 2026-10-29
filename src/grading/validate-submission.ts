import type { QuestionFile, SubmittedFile } from '../types';

export const MAX_FILE_BYTES = 128 * 1024;
export const MAX_TOTAL_BYTES = 512 * 1024;

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

export function validateSubmission(
  submitted: SubmittedFile[],
  questionFiles: QuestionFile[],
): ValidationResult {
  const errors: string[] = [];
  const byPath = new Map(questionFiles.map((f) => [f.path, f]));
  const seen = new Set<string>();
  let total = 0;

  for (const file of submitted) {
    // Two entries for one path would both be rendered into the grading prompt,
    // labelled identically, letting a learner show the grader a correct-looking
    // version alongside their real code.
    if (seen.has(file.path)) {
      errors.push(`"${file.path}" was submitted more than once`);
      continue;
    }
    seen.add(file.path);

    const known = byPath.get(file.path);
    if (!known) {
      errors.push(`"${file.path}" is not part of this question`);
      continue;
    }
    if (known.visibility !== 'editable') {
      errors.push(`"${file.path}" is read-only and cannot be modified`);
    }
    const bytes = Buffer.byteLength(file.content, 'utf8');
    if (bytes > MAX_FILE_BYTES) {
      errors.push(`"${file.path}" is too large (${bytes} bytes, max ${MAX_FILE_BYTES})`);
    }
    if (CONTROL_CHARS.test(file.content)) {
      errors.push(`"${file.path}" contains control or binary characters`);
    }
    total += bytes;
  }

  if (total > MAX_TOTAL_BYTES) {
    errors.push(`Submission is too large (${total} bytes, max ${MAX_TOTAL_BYTES})`);
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
