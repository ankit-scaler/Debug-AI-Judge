import { expect, test, vi } from 'vitest';
import { grade } from './grade.js';
import type { QuestionFile, RubricCriterion, SubmittedFile, Verdict } from '../types.js';

const rubric: RubricCriterion[] = [
  { id: 'c1', kind: 'root_cause', description: 'reads cart.items' },
];
const questionFiles: QuestionFile[] = [
  { path: 'src/App.jsx', content: 'export default function App() {}', visibility: 'editable' },
];
const passing: Verdict = { criteria: [{ id: 'c1', passed: true, evidence: 'x' }], passed: true };

function deps(overrides: Record<string, unknown> = {}) {
  return {
    cache: { get: vi.fn(async () => null), put: vi.fn(async () => {}) },
    spend: {
      monthToDateUsd: vi.fn(async () => 0),
      ceilingUsd: vi.fn(async () => 100),
      record: vi.fn(async () => {}),
    },
    firstPass: { claim: vi.fn(async () => true) },
    callModel: vi.fn(async () => ({
      raw: passing,
      usage: { inputTokens: 3500, outputTokens: 500, cachedInputTokens: 2000 },
      latencyMs: 1200,
    })),
    promptText: 'grade this',
    promptVersion: 'v1',
    userId: 'u1',
    ...overrides,
  } as any;
}

function input(submitted: SubmittedFile[]) {
  return {
    questionId: 'q1',
    questionVersion: 1,
    entry: 'src/App.jsx',
    scenario: 'cart',
    symptom: 'nothing happens',
    rubric,
    referenceFix: [{ path: 'src/App.jsx', content: 'export default function App() { return null; }' }],
    questionFiles,
    submitted,
  };
}

const valid = [{ path: 'src/App.jsx', content: 'export default function App() { return null; }' }];

test('a cache hit skips the build gate and the model call', async () => {
  const d = deps({ cache: { get: vi.fn(async () => passing), put: vi.fn(async () => {}) } });
  const r = await grade(input(valid), d);
  expect(r).toMatchObject({ status: 'graded', cacheHit: true, costUsd: 0 });
  expect(d.callModel).not.toHaveBeenCalled();
});

test('an invalid submission never reaches the model', async () => {
  const d = deps();
  const r = await grade(input([{ path: 'src/Other.jsx', content: '' }]), d);
  expect(r.status).toBe('invalid_submission');
  expect(d.callModel).not.toHaveBeenCalled();
});

test('a build failure fails for free', async () => {
  const d = deps();
  const r = await grade(input([{ path: 'src/App.jsx', content: 'export default function App() { return <div>;' }]), d);
  expect(r.status).toBe('build_failed');
  expect(d.callModel).not.toHaveBeenCalled();
});

test('a breached ceiling returns grading_unavailable and spends nothing', async () => {
  const d = deps({
    spend: {
      monthToDateUsd: vi.fn(async () => 101),
      ceilingUsd: vi.fn(async () => 100),
      record: vi.fn(async () => {}),
    },
  });
  const r = await grade(input(valid), d);
  expect(r).toEqual({ status: 'grading_unavailable', reason: 'spend_ceiling' });
  expect(d.callModel).not.toHaveBeenCalled();
});

test('a successful grade caches the verdict and records usage with the prompt version', async () => {
  const d = deps();
  const r = await grade(input(valid), d);
  expect(r.status).toBe('graded');
  expect(d.cache.put).toHaveBeenCalledOnce();
  expect(d.spend.record).toHaveBeenCalledWith(
    expect.objectContaining({ promptVersion: 'v1', model: 'anthropic/claude-sonnet-4.6', cacheHit: false }),
  );
});

test('a schema-invalid verdict is a system error, never a learner fail', async () => {
  const d = deps({
    callModel: vi.fn(async () => ({
      raw: { criteria: [{ id: 'c9', passed: true, evidence: 'x' }], passed: true },
      usage: { inputTokens: 1, outputTokens: 1, cachedInputTokens: 0 },
      latencyMs: 10,
    })),
  });
  const r = await grade(input(valid), d);
  expect(r.status).toBe('system_error');
  expect(d.cache.put).not.toHaveBeenCalled();
});

test('a thrown model error is a system error, and usage is still recorded', async () => {
  const d = deps({ callModel: vi.fn(async () => { throw new Error('429'); }) });
  const r = await grade(input(valid), d);
  expect(r.status).toBe('system_error');
});

test('only one of two concurrent passes claims the score', async () => {
  let claimed = false;
  const claim = vi.fn(async () => {
    if (claimed) return false;
    claimed = true;
    return true;
  });
  const d1 = deps({ firstPass: { claim } });
  const d2 = deps({ firstPass: { claim } });
  const [a, b] = await Promise.all([grade(input(valid), d1), grade(input(valid), d2)]);
  const scored = [a, b].filter((r) => r.status === 'graded' && r.scored);
  expect(scored).toHaveLength(1);
});
