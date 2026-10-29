import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import type { SubmittedFile } from '../types';

/**
 * Reads every file under `dir` recursively, with paths relative to `dir`.
 *
 * Paths are always posix-style whatever the host OS, because they are compared
 * against the posix paths recorded in a question's visibility map and in
 * submissions from the browser.
 */
export async function readDirFiles(dir: string): Promise<SubmittedFile[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const out: SubmittedFile[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const absolute = join(entry.parentPath, entry.name);
    out.push({
      path: relative(dir, absolute).split(sep).join('/'),
      content: await readFile(absolute, 'utf8'),
    });
  }
  return out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}
