import { expect, test } from 'vitest';
import { parseVerdict, verdictJsonSchema } from './verdict-schema.js';
import type { RubricCriterion } from '../types.js';

const rubric: RubricCriterion[] = [
  { id: 'c1', kind: 'root_cause', description: 'reads cart.items' },
  { id: 'c2', kind: 'anti_shortcut', description: 'does not hardcode the cart' },
];

test('the schema forbids extra properties and requires every field', () => {
  const s = verdictJsonSchema(rubric) as any;
  expect(s.additionalProperties).toBe(false);
  expect(s.required).toEqual(['criteria', 'passed']);
  expect(s.properties.criteria.items.required).toEqual(['id', 'passed', 'evidence']);
});

test('accepts a well-formed verdict', () => {
  const r = parseVerdict(
    { criteria: [
      { id: 'c1', passed: true, evidence: 'setItems(data.cart.items)' },
      { id: 'c2', passed: true, evidence: 'no literal array present' },
    ], passed: true },
    rubric,
  );
  expect(r.ok).toBe(true);
});

test('rejects a verdict missing a criterion', () => {
  const r = parseVerdict(
    { criteria: [{ id: 'c1', passed: true, evidence: 'x' }], passed: true },
    rubric,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.reason).toMatch(/c2/);
});

test('rejects a verdict naming a criterion not in the rubric', () => {
  const r = parseVerdict(
    { criteria: [
      { id: 'c1', passed: true, evidence: 'x' },
      { id: 'c2', passed: true, evidence: 'x' },
      { id: 'c9', passed: true, evidence: 'x' },
    ], passed: true },
    rubric,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.reason).toMatch(/c9/);
});

test('rejects a verdict whose overall flag contradicts its criteria', () => {
  const r = parseVerdict(
    { criteria: [
      { id: 'c1', passed: true, evidence: 'x' },
      { id: 'c2', passed: false, evidence: 'x' },
    ], passed: true },
    rubric,
  );
  expect(r.ok).toBe(false);
  expect(r.ok === false && r.reason).toMatch(/contradict/i);
});

test('rejects a non-object', () => {
  expect(parseVerdict('all good', rubric).ok).toBe(false);
  expect(parseVerdict(null, rubric).ok).toBe(false);
});

test('rejects a non-boolean passed field', () => {
  const r = parseVerdict(
    { criteria: [
      { id: 'c1', passed: 'yes', evidence: 'x' },
      { id: 'c2', passed: true, evidence: 'x' },
    ], passed: true },
    rubric,
  );
  expect(r.ok).toBe(false);
});
