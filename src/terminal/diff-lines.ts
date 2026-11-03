// src/terminal/diff-lines.ts
export interface DiffLine {
  type: 'added' | 'removed';
  text: string;
}

/** One contiguous run of changes, like a `@@` hunk in real `git diff` output. */
export interface DiffHunk {
  /** 1-based line number in the original file where this hunk starts. */
  oldStart: number;
  /** 1-based line number in the edited file where this hunk starts. */
  newStart: number;
  lines: DiffLine[];
}

function toLines(text: string): string[] {
  const lines = text.split('\n');
  // A file ending in a newline yields one trailing '' -- drop it so that
  // final newline never shows up as a phantom blank-line change.
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Line-level diff via a longest-common-subsequence table. O(n*m) memory and
 * time -- fine for question files (a few hundred lines at most: 300x300 is
 * 90k cells). Unchanged lines split changes into separate hunks, so two
 * unrelated edits in one file print as two small hunks, not one big
 * removed-then-added block spanning everything between them.
 */
export function diffLines(original: string, edited: string): DiffHunk[] {
  const a = toLines(original);
  const b = toLines(edited);
  const n = a.length;
  const m = b.length;

  // lcs[i][j] = length of the longest common subsequence of a[i..] and b[j..]
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i]![j] = a[i] === b[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }

  const hunks: DiffHunk[] = [];
  let current: DiffHunk | null = null;
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      current = null; // an unchanged line closes the current hunk
      i++;
      j++;
      continue;
    }
    if (current === null) {
      current = { oldStart: i + 1, newStart: j + 1, lines: [] };
      hunks.push(current);
    }
    // On a tie, emit the removal first, so a changed line reads as
    // "- old" then "+ new", the way git prints it.
    if (i < n && (j === m || lcs[i + 1]![j]! >= lcs[i]![j + 1]!)) {
      current.lines.push({ type: 'removed', text: a[i]! });
      i++;
    } else {
      current.lines.push({ type: 'added', text: b[j]! });
      j++;
    }
  }
  return hunks;
}
