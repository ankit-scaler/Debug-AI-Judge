import { expect, test } from 'vitest';
import { validateSubmission, MAX_FILE_BYTES, MAX_TOTAL_BYTES } from './validate-submission.js';
import type { QuestionFile } from '../types.js';

const questionFiles: QuestionFile[] = [
  { path: 'src/App.jsx', content: 'export default function App() {}', visibility: 'editable' },
  { path: 'mock/handlers.js', content: 'export const handlers = [];', visibility: 'readonly' },
  { path: 'notes/author.md', content: 'the bug is on line 4', visibility: 'hidden' },
];

test('accepts edits to editable files', () => {
  const r = validateSubmission(
    [{ path: 'src/App.jsx', content: 'export default function App() { return null; }' }],
    questionFiles,
  );
  expect(r).toEqual({ ok: true });
});

test('rejects a path that is not part of the question', () => {
  const r = validateSubmission([{ path: 'src/Sneaky.jsx', content: '' }], questionFiles);
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/not part of this question/i);
});

test('rejects path traversal', () => {
  const r = validateSubmission([{ path: '../../etc/passwd', content: '' }], questionFiles);
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/not part of this question/i);
});

test('rejects edits to a readonly file', () => {
  const r = validateSubmission([{ path: 'mock/handlers.js', content: 'hacked' }], questionFiles);
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/read-only/i);
});

test('rejects edits to a hidden file', () => {
  const r = validateSubmission([{ path: 'notes/author.md', content: 'x' }], questionFiles);
  expect(r.ok).toBe(false);
});

test('rejects a single oversized file before any model call', () => {
  const r = validateSubmission(
    [{ path: 'src/App.jsx', content: 'x'.repeat(MAX_FILE_BYTES + 1) }],
    questionFiles,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/too large/i);
});

test('rejects an oversized submission in aggregate', () => {
  const big = 'x'.repeat(MAX_FILE_BYTES - 1);
  const files = Array.from({ length: Math.ceil(MAX_TOTAL_BYTES / big.length) + 1 }, () => ({
    path: 'src/App.jsx',
    content: big,
  }));
  const r = validateSubmission(files, questionFiles);
  expect(r.ok).toBe(false);
});

test('rejects content that is not valid UTF-8 text', () => {
  const r = validateSubmission(
    [{ path: 'src/App.jsx', content: 'bad\u0000byte' }],
    questionFiles,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/binary|control/i);
});
