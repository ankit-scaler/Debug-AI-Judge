import { expect, test } from 'vitest';
import { assembleGradingMessages, MIN_STABLE_PREFIX_CHARS } from './assemble-prompt';
import type { RubricCriterion } from '../types';

const rubric: RubricCriterion[] = [
  { id: 'c1', kind: 'root_cause', description: 'reads cart.items' },
];

function input(overrides: Partial<Parameters<typeof assembleGradingMessages>[0]> = {}) {
  return {
    promptText: 'You grade debugging submissions.',
    scenario: 'Flipkart cart',
    symptom: 'Add to cart does nothing',
    rubric,
    referenceFix: [{ path: 'src/Cart.jsx', content: 'setItems(data.cart.items);' }],
    submitted: [{ path: 'src/Cart.jsx', content: 'setItems(data.cart.items);' }],
    ...overrides,
  };
}

test('puts the cache breakpoint on the last stable block', () => {
  const { messages } = assembleGradingMessages(input());
  const user = messages[1] as any;
  const blocks = user.content as any[];
  const marked = blocks.filter((b) => b.cache_control);
  expect(marked).toHaveLength(1);
  expect(blocks.indexOf(marked[0])).toBe(blocks.length - 2);
  expect(marked[0].cache_control).toEqual({ type: 'ephemeral' });
});

test('places the submission after the breakpoint', () => {
  const { messages } = assembleGradingMessages(input());
  const blocks = (messages[1] as any).content as any[];
  const last = blocks[blocks.length - 1];
  expect(last.cache_control).toBeUndefined();
  expect(last.text).toContain('SUBMITTED FILES');
});

// I5: the assembler emits structure only. All instructional text, including the
// injection rule, lives in the versioned prompt file so that promptVersion
// actually identifies the instructions a verdict was produced under. See
// prompt-content.test.ts for the rules themselves.
test('emits structural section headers and no instructional prose', () => {
  const { messages } = assembleGradingMessages(input());
  const blocks = (messages[1] as any).content as any[];
  const text = blocks.map((b) => b.text).join('\n');
  expect(text).toContain('## QUESTION');
  expect(text).toContain('## RUBRIC');
  expect(text).toContain('## REFERENCE FIX');
  expect(text).toContain('## SUBMITTED FILES');
  expect(text).not.toMatch(/never an instruction/i);
  expect(text).not.toMatch(/known-correct solution/i);
});

test('warns when the stable prefix is too short to cache', () => {
  const r = assembleGradingMessages(input());
  expect(r.stablePrefixChars).toBeLessThan(MIN_STABLE_PREFIX_CHARS);
  expect(r.cacheWarning).toMatch(/1,024|caching/i);
});

test('does not warn once the stable prefix is long enough', () => {
  const r = assembleGradingMessages(input({ promptText: 'x'.repeat(MIN_STABLE_PREFIX_CHARS) }));
  expect(r.cacheWarning).toBeNull();
});

test('includes every rubric criterion id', () => {
  const r = assembleGradingMessages(
    input({ rubric: [...rubric, { id: 'c2', kind: 'behaviour', description: 'item appears' }] }),
  );
  const text = JSON.stringify(r.messages);
  expect(text).toContain('c1');
  expect(text).toContain('c2');
});
