import type { GradeDeps, UsageRecord } from '../grading/grade';
import { callModel } from '../grading/openrouter';
import { loadPrompt } from '../grading/prompt-loader';
import type { Verdict } from '../types';

/**
 * In-memory implementations of everything `grade()` needs, for running locally.
 *
 * Phase 2b replaces these with Supabase. Deliberately process-local: restarting
 * the dev server clears the verdict cache and the spend total, which is the right
 * behaviour for a local toy and the wrong behaviour for production.
 */
export const LOCAL_USER_ID = 'local-dev';

const verdictCache = new Map<string, Verdict>();
const firstPassClaims = new Set<string>();
const gaveUpClaims = new Set<string>();
const usageLog: UsageRecord[] = [];
let spentUsd = 0;

/**
 * Records that a user viewed this question's solution before earning a
 * legitimate pass on it. Called by the give-up route, before it hands back
 * the reference fix. Permanent for the life of this server process -- there
 * is no "undo", matching the rest of this phase's state (D12: no login, no
 * database; restarting the dev server is the only reset).
 */
export function recordGiveUp(userId: string, questionId: string): void {
  gaveUpClaims.add(`${userId}::${questionId}`);
}

const DEFAULT_CEILING_USD = 5;

export function ceilingUsd(): number {
  const raw = process.env.AI_MONTHLY_CEILING_USD;
  if (raw === undefined || raw === '') return DEFAULT_CEILING_USD;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CEILING_USD;
}

export interface LocalSpend {
  spentUsd: number;
  ceilingUsd: number;
  calls: number;
}

export function localSpend(): LocalSpend {
  return { spentUsd, ceilingUsd: ceilingUsd(), calls: usageLog.length };
}

export async function localGradeDeps(userId = LOCAL_USER_ID): Promise<GradeDeps> {
  const prompt = await loadPrompt('grader', process.env.GRADER_PROMPT_VERSION ?? 'v1');

  return {
    cache: {
      get: async (hash) => verdictCache.get(hash) ?? null,
      put: async (hash, verdict) => {
        verdictCache.set(hash, verdict);
      },
    },
    spend: {
      monthToDateUsd: async () => spentUsd,
      ceilingUsd: async () => ceilingUsd(),
      record: async (entry) => {
        spentUsd += entry.costUsd;
        usageLog.push(entry);
        const flags = [entry.cacheWarning, ...entry.costWarnings].filter(Boolean);
        console.log(
          `[ai_usage] ${entry.feature} ${entry.model} ${entry.promptVersion} ` +
            `in=${entry.usage.inputTokens} cached=${entry.usage.cachedInputTokens} ` +
            `out=${entry.usage.outputTokens} $${entry.costUsd.toFixed(5)} ` +
            `${entry.latencyMs}ms  (month-to-date $${spentUsd.toFixed(5)} of $${ceilingUsd()})`,
        );
        for (const flag of flags) console.warn(`[ai_usage] warning: ${flag}`);
      },
    },
    firstPass: {
      claim: async (uid, questionId) => {
        const key = `${uid}::${questionId}`;
        if (firstPassClaims.has(key)) return false;
        firstPassClaims.add(key);
        return true;
      },
    },
    gaveUp: {
      has: async (uid, questionId) => gaveUpClaims.has(`${uid}::${questionId}`),
    },
    callModel,
    promptText: prompt.text,
    promptVersion: prompt.version,
    userId,
    apiKey: process.env.OPENROUTER_API_KEY,
  };
}
