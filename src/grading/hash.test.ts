import { expect, test } from 'vitest';
import { submissionHash } from './hash';

const a = { path: 'src/A.jsx', content: 'const a = 1;\n' };
const b = { path: 'src/B.jsx', content: 'const b = 2;\n' };

test('is stable regardless of file order', () => {
  expect(submissionHash('q1', 1, [a, b])).toBe(submissionHash('q1', 1, [b, a]));
});

test('ignores line-ending differences', () => {
  expect(submissionHash('q1', 1, [{ path: 'x.js', content: 'a\r\nb\r\n' }])).toBe(
    submissionHash('q1', 1, [{ path: 'x.js', content: 'a\nb\n' }]),
  );
});

test('ignores a missing trailing newline', () => {
  expect(submissionHash('q1', 1, [{ path: 'x.js', content: 'a' }])).toBe(
    submissionHash('q1', 1, [{ path: 'x.js', content: 'a\n' }]),
  );
});

test('distinguishes any change in content', () => {
  expect(submissionHash('q1', 1, [a])).not.toBe(
    submissionHash('q1', 1, [{ ...a, content: 'const a = 2;\n' }]),
  );
});

test('distinguishes indentation, which can be semantic in JSX', () => {
  expect(submissionHash('q1', 1, [{ path: 'x.js', content: 'a\n  b\n' }])).not.toBe(
    submissionHash('q1', 1, [{ path: 'x.js', content: 'a\nb\n' }]),
  );
});

test('is scoped to the question version', () => {
  expect(submissionHash('q1', 1, [a])).not.toBe(submissionHash('q1', 2, [a]));
});

test('is scoped to the question', () => {
  expect(submissionHash('q1', 1, [a])).not.toBe(submissionHash('q2', 1, [a]));
});

test('returns 64 hex characters', () => {
  expect(submissionHash('q1', 1, [a])).toMatch(/^[0-9a-f]{64}$/);
});
