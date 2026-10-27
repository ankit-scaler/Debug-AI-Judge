import type { CriterionVerdict, RubricCriterion, Verdict } from '../types.js';

export type ParsedVerdict =
  | { ok: true; verdict: Verdict }
  | { ok: false; reason: string };

export function verdictJsonSchema(rubric: RubricCriterion[]): object {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['criteria', 'passed'],
    properties: {
      criteria: {
        type: 'array',
        minItems: rubric.length,
        maxItems: rubric.length,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'passed', 'evidence'],
          properties: {
            id: {
              type: 'string',
              enum: rubric.map((c) => c.id),
              description: 'The rubric criterion this verdict is for.',
            },
            passed: {
              type: 'boolean',
              description: 'True only if the criterion is fully satisfied.',
            },
            evidence: {
              type: 'string',
              description:
                'A short quote from the submitted code supporting this verdict.',
            },
          },
        },
      },
      passed: { type: 'boolean', description: 'True only if every criterion passed.' },
    },
  };
}

export function parseVerdict(raw: unknown, rubric: RubricCriterion[]): ParsedVerdict {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, reason: 'Verdict is not an object' };
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj.passed !== 'boolean') {
    return { ok: false, reason: 'Verdict "passed" is not a boolean' };
  }
  if (!Array.isArray(obj.criteria)) {
    return { ok: false, reason: 'Verdict "criteria" is not an array' };
  }

  const expected = new Set(rubric.map((c) => c.id));
  const seen = new Set<string>();
  const criteria: CriterionVerdict[] = [];

  for (const entry of obj.criteria) {
    if (typeof entry !== 'object' || entry === null) {
      return { ok: false, reason: 'A criterion verdict is not an object' };
    }
    const c = entry as Record<string, unknown>;
    if (typeof c.id !== 'string') return { ok: false, reason: 'A criterion id is not a string' };
    if (typeof c.passed !== 'boolean') {
      return { ok: false, reason: `Criterion "${c.id}" has a non-boolean passed field` };
    }
    if (typeof c.evidence !== 'string') {
      return { ok: false, reason: `Criterion "${c.id}" has a non-string evidence field` };
    }
    // A pass must be evidenced. This is the only thing standing between a
    // fabricated pass and a score, and the prompt alone cannot enforce it: §9
    // records that some providers treat the schema as a hint. A fail needs no
    // evidence, since a fail awards nothing.
    if (c.passed === true && c.evidence.trim() === '') {
      return { ok: false, reason: `Criterion "${c.id}" passed with no evidence` };
    }
    if (!expected.has(c.id)) {
      return { ok: false, reason: `Criterion "${c.id}" is not in the rubric` };
    }
    if (seen.has(c.id)) {
      return { ok: false, reason: `Criterion "${c.id}" appears more than once` };
    }
    seen.add(c.id);
    criteria.push({ id: c.id, passed: c.passed, evidence: c.evidence });
  }

  const missing = [...expected].filter((id) => !seen.has(id));
  if (missing.length > 0) {
    return { ok: false, reason: `Verdict omits criteria: ${missing.join(', ')}` };
  }

  const allPassed = criteria.every((c) => c.passed);
  if (allPassed !== obj.passed) {
    return {
      ok: false,
      reason: `Overall "passed" (${obj.passed}) contradicts the criteria (${allPassed})`,
    };
  }

  return { ok: true, verdict: { criteria, passed: obj.passed } };
}
