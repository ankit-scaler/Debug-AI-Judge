// src/terminal/diff-lines.test.ts
import { describe, expect, test } from 'vitest';
import { diffLines } from './diff-lines';

describe('diffLines', () => {
  test('identical files produce no hunks', () => {
    const a = 'line1\nline2\n';
    expect(diffLines(a, a)).toEqual([]);
  });

  test('an added line is one hunk with one added line', () => {
    expect(diffLines('a\nb\n', 'a\nb\nc\n')).toEqual([
      { oldStart: 3, newStart: 3, lines: [{ type: 'added', text: 'c' }] },
    ]);
  });

  test('a removed line is one hunk with one removed line', () => {
    expect(diffLines('a\nb\nc\n', 'a\nc\n')).toEqual([
      { oldStart: 2, newStart: 2, lines: [{ type: 'removed', text: 'b' }] },
    ]);
  });

  test('a changed line shows as one removed then one added, not "changed"', () => {
    expect(diffLines('const x = 1;\n', 'const x = 2;\n')).toEqual([
      {
        oldStart: 1,
        newStart: 1,
        lines: [
          { type: 'removed', text: 'const x = 1;' },
          { type: 'added', text: 'const x = 2;' },
        ],
      },
    ]);
  });

  test('two separate edits in one file are two small hunks, not one wall of noise', () => {
    // The real flipkart fix has exactly this shape: several unrelated edits
    // in one file (cartHandlers.js) with untouched lines between them.
    const original = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].join('\n') + '\n';
    const edited = ['a', 'B', 'c', 'd', 'e', 'F', 'g'].join('\n') + '\n';
    expect(diffLines(original, edited)).toEqual([
      { oldStart: 2, newStart: 2, lines: [{ type: 'removed', text: 'b' }, { type: 'added', text: 'B' }] },
      { oldStart: 6, newStart: 6, lines: [{ type: 'removed', text: 'f' }, { type: 'added', text: 'F' }] },
    ]);
  });

  test('a moved block does not drag every line between the two edits into the diff', () => {
    const original = 'x\nkeep1\nkeep2\nkeep3\ny\n';
    const edited = 'keep1\nkeep2\nkeep3\ny\nx\n';
    const changed = diffLines(original, edited).flatMap((h) => h.lines);
    expect(changed).toEqual([
      { type: 'removed', text: 'x' },
      { type: 'added', text: 'x' },
    ]);
  });

  test('trailing-whitespace-only changes still diff as a real change (no -w), confined to that line', () => {
    // Deliberately NOT collapsed to "same" -- real `git diff` without -w
    // shows these too. What matters is that the noise stays on the one
    // line that changed, not that it is hidden.
    expect(diffLines('a\nconst x = 1;\nb\n', 'a\nconst x = 1; \nb\n')).toEqual([
      {
        oldStart: 2,
        newStart: 2,
        lines: [
          { type: 'removed', text: 'const x = 1;' },
          { type: 'added', text: 'const x = 1; ' },
        ],
      },
    ]);
  });
});
