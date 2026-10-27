import type { Usage } from '../types.js';

export const GRADER_MODEL = 'anthropic/claude-sonnet-4.6';
export const FEEDBACK_MODEL = 'anthropic/claude-haiku-5.5';

export interface ModelPrice {
  inputPerMTok: number;
  outputPerMTok: number;
}

/** Verified against OpenRouter on 2026-10-27. Inference is billed at list price. */
export const MODEL_PRICES: Record<string, ModelPrice> = {
  'anthropic/claude-sonnet-4.6': { inputPerMTok: 3, outputPerMTok: 15 },
  'anthropic/claude-haiku-5.5': { inputPerMTok: 0.1, outputPerMTok: 0.5 },
};

const CACHE_READ_MULTIPLIER = 0.1;

export function costUsd(model: string, usage: Usage): number {
  const price = MODEL_PRICES[model];
  if (!price) throw new Error(`Unknown model "${model}": refusing to guess a price`);
  if (usage.cachedInputTokens > usage.inputTokens) {
    throw new Error(
      `Cached input tokens (${usage.cachedInputTokens}) exceed input tokens (${usage.inputTokens})`,
    );
  }
  const fresh = usage.inputTokens - usage.cachedInputTokens;
  return (
    (fresh * price.inputPerMTok) / 1_000_000 +
    (usage.cachedInputTokens * price.inputPerMTok * CACHE_READ_MULTIPLIER) / 1_000_000 +
    (usage.outputTokens * price.outputPerMTok) / 1_000_000
  );
}
