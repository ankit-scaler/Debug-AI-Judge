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

test('rejects an oversized submission in aggregate, naming the aggregate limit', () => {
  // Distinct paths, so the rejection can only come from the aggregate check.
  const editable: QuestionFile[] = Array.from({ length: 6 }, (_, i) => ({
    path: `src/F${i}.jsx`,
    content: '',
    visibility: 'editable' as const,
  }));
  const chunk = 'x'.repeat(MAX_FILE_BYTES - 1);
  const files = editable.map((f) => ({ path: f.path, content: chunk }));
  expect(files.length * chunk.length).toBeGreaterThan(MAX_TOTAL_BYTES);
  const r = validateSubmission(files, editable);
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/Submission is too large/i);
});

test('rejects content that is not valid UTF-8 text', () => {
  const r = validateSubmission(
    [{ path: 'src/App.jsx', content: 'bad\u0000byte' }],
    questionFiles,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/binary|control/i);
});

// C4: two entries for one path let a learner show the grader the reference fix
// next to their real code. Both get rendered into the prompt, labelled the same.
test('rejects duplicate submitted paths', () => {
  const r = validateSubmission(
    [
      { path: 'src/App.jsx', content: 'const items = data.cart.items; // the good fix' },
      { path: 'src/App.jsx', content: 'const items = data.items; // the real buggy code' },
    ],
    questionFiles,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.errors.join()).toMatch(/more than once/i);
});
