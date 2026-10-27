import { expect, test } from 'vitest';
import { costUsd, GRADER_MODEL, MODEL_PRICES, priceUsage } from './cost.js';
import type { Usage } from '../types.js';

function usage(over: Partial<Usage> = {}): Usage {
  return {
    inputTokens: 0,
    outputTokens: 0,
    cachedInputTokens: 0,
    cacheWriteInputTokens: 0,
    reportedCostUsd: null,
    ...over,
  };
}

test('the grader model is pinned, not an alias', () => {
  expect(GRADER_MODEL).toBe('anthropic/claude-sonnet-4.6');
  expect(GRADER_MODEL).not.toContain('latest');
  expect(GRADER_MODEL).not.toContain('~');
});

test('prices Sonnet 4.6 at 3 and 15 dollars per million', () => {
  expect(MODEL_PRICES[GRADER_MODEL]).toEqual({ inputPerMTok: 3, outputPerMTok: 15 });
});

test('charges uncached input at full rate', () => {
  expect(costUsd(GRADER_MODEL, usage({ inputTokens: 1_000_000 }))).toBeCloseTo(3, 6);
});

test('charges cached input at one tenth', () => {
  const c = costUsd(GRADER_MODEL, usage({ inputTokens: 1_000_000, cachedInputTokens: 1_000_000 }));
  expect(c).toBeCloseTo(0.3, 6);
});

test('charges cache writes at 1.25x', () => {
  const c = costUsd(GRADER_MODEL, usage({ inputTokens: 2000, cacheWriteInputTokens: 2000 }));
  expect(c).toBeCloseTo((2000 * 3 * 1.25) / 1_000_000, 10);
});

test('splits a partly cached prompt correctly', () => {
  const c = costUsd(GRADER_MODEL, usage({ inputTokens: 3500, outputTokens: 500, cachedInputTokens: 2000 }));
  expect(c).toBeCloseTo(0.0045 + 0.0006 + 0.0075, 8);
});

test('reproduces the measured cost of a real cache read', () => {
  // Observed 2026-10-27: prompt_tokens 5521, cached 5511, upstream prompt cost 0.0016833.
  const c = costUsd(GRADER_MODEL, usage({ inputTokens: 5521, outputTokens: 4, cachedInputTokens: 5511 }));
  expect(c).toBeCloseTo(0.0016833 + (4 * 15) / 1_000_000, 6);
});

test('reproduces the measured cost of a real cache write', () => {
  // Observed 2026-10-27: 5511 write tokens, upstream prompt cost 0.02069625.
  const c = costUsd(GRADER_MODEL, usage({ inputTokens: 5521, cacheWriteInputTokens: 5511, outputTokens: 0 }));
  expect(c).toBeCloseTo(0.02069625, 5);
});

test('clamps impossible cached counts instead of throwing on a path a learner is waiting on', () => {
  const r = priceUsage(GRADER_MODEL, usage({ inputTokens: 1500, outputTokens: 500, cachedInputTokens: 2000 }));
  expect(r.costUsd).toBeCloseTo((1500 * 3 * 0.1) / 1_000_000 + (500 * 15) / 1_000_000, 10);
  expect(r.warnings.join()).toMatch(/exceed/i);
});

test('flags a large divergence from the provider reported cost', () => {
  const r = priceUsage(GRADER_MODEL, usage({ inputTokens: 1000, outputTokens: 0, reportedCostUsd: 1 }));
  expect(r.warnings.join()).toMatch(/reported/i);
});

test('does not flag a close match to the provider reported cost', () => {
  const r = priceUsage(GRADER_MODEL, usage({ inputTokens: 1_000_000, outputTokens: 0, reportedCostUsd: 3 }));
  expect(r.warnings).toEqual([]);
});

test('throws on an unknown model rather than guessing a price', () => {
  expect(() => costUsd('anthropic/made-up', usage({ inputTokens: 1 }))).toThrow(/unknown model/i);
});
