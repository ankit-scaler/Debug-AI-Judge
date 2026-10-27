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

/** Both multipliers confirmed against live usage/cost figures on 2026-10-27. */
const CACHE_READ_MULTIPLIER = 0.1;
const CACHE_WRITE_MULTIPLIER = 1.25; // 5-minute TTL; a 1h TTL write would be 2x
const REPORTED_COST_TOLERANCE = 0.25;

export interface PricedUsage {
  costUsd: number;
  warnings: string[];
}

/**
 * Prices a call and reports anomalies rather than throwing. Submits run through
 * here with a learner waiting, so a surprising usage shape must degrade to a
 * flagged number, never to a rejected promise.
 */
export function priceUsage(model: string, usage: Usage): PricedUsage {
  const price = MODEL_PRICES[model];
  if (!price) throw new Error(`Unknown model "${model}": refusing to guess a price`);

  const warnings: string[] = [];
  let cached = usage.cachedInputTokens;
  let written = usage.cacheWriteInputTokens;

  if (cached + written > usage.inputTokens) {
    warnings.push(
      `Cached (${cached}) plus cache-write (${written}) tokens exceed input tokens (${usage.inputTokens}); clamping`,
    );
    written = Math.min(written, usage.inputTokens);
    cached = Math.max(0, Math.min(cached, usage.inputTokens - written));
  }

  const fresh = Math.max(0, usage.inputTokens - cached - written);
  const costUsd =
    (fresh * price.inputPerMTok) / 1_000_000 +
    (cached * price.inputPerMTok * CACHE_READ_MULTIPLIER) / 1_000_000 +
    (written * price.inputPerMTok * CACHE_WRITE_MULTIPLIER) / 1_000_000 +
    (usage.outputTokens * price.outputPerMTok) / 1_000_000;

  if (usage.reportedCostUsd !== null) {
    const divergence = Math.abs(usage.reportedCostUsd - costUsd);
    const scale = Math.max(usage.reportedCostUsd, costUsd, 1e-9);
    if (divergence / scale > REPORTED_COST_TOLERANCE) {
      warnings.push(
        `Computed cost ${costUsd.toFixed(6)} diverges from provider reported cost ${usage.reportedCostUsd.toFixed(6)}`,
      );
    }
  }

  return { costUsd, warnings };
}

export function costUsd(model: string, usage: Usage): number {
  return priceUsage(model, usage).costUsd;
}
