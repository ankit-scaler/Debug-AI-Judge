import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { loadCases } from './load-cases.js';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'evalcases-'));
  const dir = join(root, 'cart-field-mismatch');
  await mkdir(join(dir, 'question'), { recursive: true });
  await mkdir(join(dir, 'reference'), { recursive: true });
  await mkdir(join(dir, 'attempt'), { recursive: true });
  await writeFile(join(dir, 'case.json'), JSON.stringify({
    questionId: 'q1',
    questionVersion: 1,
    entry: 'App.jsx',
    scenario: 'Flipkart cart',
    symptom: 'nothing happens',
    visibility: { 'App.jsx': 'editable' },
    rubric: [{ id: 'c1', kind: 'root_cause', description: 'reads cart.items' }],
    expected: { passed: true, criteria: { c1: true } },
  }));
  await writeFile(join(dir, 'question', 'App.jsx'), 'const a = 1;\n');
  await writeFile(join(dir, 'reference', 'App.jsx'), 'const a = 2;\n');
  await writeFile(join(dir, 'attempt', 'App.jsx'), 'const a = 2;\n');
  return root;
}

test('loads a case with its files and expectation', async () => {
  const cases = await loadCases(await fixture());
  expect(cases).toHaveLength(1);
  const c = cases[0]!;
  expect(c.caseId).toBe('cart-field-mismatch');
  expect(c.questionFiles).toEqual([{ path: 'App.jsx', content: 'const a = 1;\n', visibility: 'editable' }]);
  expect(c.submitted).toEqual([{ path: 'App.jsx', content: 'const a = 2;\n' }]);
  expect(c.expected.passed).toBe(true);
});

test('rejects a case whose expected criteria do not match its rubric', async () => {
  const root = await fixture();
  await writeFile(
    join(root, 'cart-field-mismatch', 'case.json'),
    JSON.stringify({
      questionId: 'q1', questionVersion: 1, entry: 'App.jsx',
      scenario: 's', symptom: 'y', visibility: { 'App.jsx': 'editable' },
      rubric: [{ id: 'c1', kind: 'root_cause', description: 'd' }],
      expected: { passed: true, criteria: { c2: true } },
    }),
  );
  await expect(loadCases(root)).rejects.toThrow(/c2/);
});

test('rejects a case whose expected overall contradicts its expected criteria', async () => {
  const root = await fixture();
  await writeFile(
    join(root, 'cart-field-mismatch', 'case.json'),
    JSON.stringify({
      questionId: 'q1', questionVersion: 1, entry: 'App.jsx',
      scenario: 's', symptom: 'y', visibility: { 'App.jsx': 'editable' },
      rubric: [{ id: 'c1', kind: 'root_cause', description: 'd' }],
      expected: { passed: true, criteria: { c1: false } },
    }),
  );
  await expect(loadCases(root)).rejects.toThrow(/contradict/i);
});
