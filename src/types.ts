export const CRITERION_KINDS = [
  'root_cause',
  'behaviour',
  'anti_shortcut',
  'no_regression',
] as const;

export type CriterionKind = (typeof CRITERION_KINDS)[number];
export type Visibility = 'editable' | 'readonly' | 'hidden';

export interface QuestionFile {
  path: string;
  content: string;
  visibility: Visibility;
}

export interface SubmittedFile {
  path: string;
  content: string;
}

export interface RubricCriterion {
  id: string;
  kind: CriterionKind;
  description: string;
}

export interface CriterionVerdict {
  id: string;
  passed: boolean;
  evidence: string;
}

export interface Verdict {
  criteria: CriterionVerdict[];
  passed: boolean;
}

export interface Usage {
  /** Total prompt tokens. Verified 2026-10-27: includes cached and cache-write tokens. */
  inputTokens: number;
  outputTokens: number;
  /** Subset of inputTokens served from cache, billed at 0.1x. */
  cachedInputTokens: number;
  /** Subset of inputTokens written to cache, billed at 1.25x (5-minute TTL). */
  cacheWriteInputTokens: number;
  /** The provider's own cost figure, when it reports one. Authoritative over our price table. */
  reportedCostUsd: number | null;
}
