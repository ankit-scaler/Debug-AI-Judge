import { createHash } from 'node:crypto';
import type { SubmittedFile } from '../types';

function normalise(content: string): string {
  return content.replace(/\r\n/g, '\n').replace(/\n+$/, '') + '\n';
}

export function submissionHash(
  questionId: string,
  questionVersion: number,
  files: SubmittedFile[],
): string {
  const sorted = [...files].sort((x, y) => (x.path < y.path ? -1 : x.path > y.path ? 1 : 0));
  const h = createHash('sha256');
  h.update(`${questionId}\u0000${questionVersion}\u0000`);
  for (const f of sorted) {
    h.update(f.path);
    h.update('\u0000');
    h.update(normalise(f.content));
    h.update('\u0000');
  }
  return h.digest('hex');
}
