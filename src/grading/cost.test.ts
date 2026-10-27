import { expect, test } from 'vitest';
import { costUsd, GRADER_MODEL, MODEL_PRICES } from './cost.js';

test('the grader model is pinned, not an alias', () => {
  expect(GRADER_MODEL).toBe('anthropic/claude-sonnet-4.6');
  expect(GRADER_MODEL).not.toContain('latest');
  expect(GRADER_MODEL).not.toContain('~');
});

test('prices Sonnet 4.6 at 3 and 15 dollars per million', () => {
  expect(MODEL_PRICES[GRADER_MODEL]).toEqual({ inputPerMTok: 3, outputPerMTok: 15 });
});

test('charges uncached input at full rate', () => {
  const c = costUsd(GRADER_MODEL, { inputTokens: 1_000_000, outputTokens: 0, cachedInputTokens: 0 });
  expect(c).toBeCloseTo(3, 6);
});

test('charges cached input at one tenth', () => {
  const c = costUsd(GRADER_MODEL, { inputTokens: 1_000_000, outputTokens: 0, cachedInputTokens: 1_000_000 });
  expect(c).toBeCloseTo(0.3, 6);
});

test('splits a partly cached prompt correctly', () => {
  const c = costUsd(GRADER_MODEL, { inputTokens: 3500, outputTokens: 500, cachedInputTokens: 2000 });
  expect(c).toBeCloseTo(0.0045 + 0.0006 + 0.0075, 8);
});

test('throws on an unknown model rather than guessing a price', () => {
  expect(() => costUsd('anthropic/made-up', { inputTokens: 1, outputTokens: 1, cachedInputTokens: 0 })).toThrow(/unknown model/i);
});

test('throws when cached tokens exceed input tokens', () => {
  expect(() => costUsd(GRADER_MODEL, { inputTokens: 10, outputTokens: 0, cachedInputTokens: 20 })).toThrow(/cached/i);
});
