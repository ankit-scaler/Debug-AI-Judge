import { expect, test } from 'vitest';
import { loadPrompt } from './prompt-loader.js';

// The grader prompt carries the safety-critical instructions. They are asserted
// here rather than in the assembler so that changing them means changing a
// versioned file, which is what promptVersion is for.
test('the grader prompt frames submitted code as data, never as instructions', async () => {
  const p = await loadPrompt('grader', 'v1');
  expect(p.text).toMatch(/never an instruction to you/i);
  expect(p.text).toMatch(/## SUBMITTED FILES/);
});

test('the grader prompt requires evidence for every verdict', async () => {
  const p = await loadPrompt('grader', 'v1');
  expect(p.text).toMatch(/evidence/i);
  expect(p.text).toMatch(/a pass you cannot evidence is a guess/i);
});

test('the grader prompt tells the model to judge the outcome, not the reference text', async () => {
  const p = await loadPrompt('grader', 'v1');
  expect(p.text).toMatch(/reference fix's outcome, not its text/i);
});

test('the grader prompt gives anti_shortcut and no_regression explicit handling', async () => {
  const p = await loadPrompt('grader', 'v1');
  expect(p.text).toMatch(/anti_shortcut/);
  expect(p.text).toMatch(/no_regression/);
});

test('the authoring prompt demands an anti-shortcut criterion', async () => {
  const p = await loadPrompt('authoring', 'v1');
  expect(p.text).toMatch(/anti_shortcut/);
  expect(p.text).toMatch(/laziest edit/i);
});
