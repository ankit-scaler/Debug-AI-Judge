import { expect, test, vi } from 'vitest';
import { callModel } from './openrouter.js';

function reply(body: unknown, status = 200) {
  // Typed with fetch's signature so the assertions below can read the init argument.
  return vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  );
}

const ok = {
  choices: [{ message: { content: '{"criteria":[],"passed":true}' } }],
  usage: { prompt_tokens: 3500, completion_tokens: 500, prompt_tokens_details: { cached_tokens: 2000 } },
};

const req = {
  model: 'anthropic/claude-sonnet-4.6',
  messages: [{ role: 'user', content: 'hi' }],
  schemaName: 'verdict',
  schema: { type: 'object' },
};

test('sends the pinned model, json_schema and require_parameters', async () => {
  const f = reply(ok);
  await callModel(req, { fetch: f as any, apiKey: 'k' });
  const body = JSON.parse((f.mock.calls[0]![1] as RequestInit).body as string);
  expect(body.model).toBe('anthropic/claude-sonnet-4.6');
  expect(body.response_format.type).toBe('json_schema');
  expect(body.response_format.json_schema.strict).toBe(true);
  expect(body.provider.require_parameters).toBe(true);
});

test('sends the API key as a bearer token', async () => {
  const f = reply(ok);
  await callModel(req, { fetch: f as any, apiKey: 'secret-key' });
  const headers = (f.mock.calls[0]![1] as RequestInit).headers as Record<string, string>;
  expect(headers.Authorization).toBe('Bearer secret-key');
});

test('extracts usage including cached tokens', async () => {
  const r = await callModel(req, { fetch: reply(ok) as any, apiKey: 'k' });
  expect(r.usage).toEqual({
    inputTokens: 3500,
    outputTokens: 500,
    cachedInputTokens: 2000,
    cacheWriteInputTokens: 0,
    reportedCostUsd: null,
  });
});

test('defaults cached tokens to zero when absent', async () => {
  const body = { ...ok, usage: { prompt_tokens: 10, completion_tokens: 2 } };
  const r = await callModel(req, { fetch: reply(body) as any, apiKey: 'k' });
  expect(r.usage.cachedInputTokens).toBe(0);
  expect(r.usage.cacheWriteInputTokens).toBe(0);
});

// Shape captured from a live OpenRouter response on 2026-10-27.
test('extracts cache-write tokens and the provider reported cost', async () => {
  const body = {
    choices: [{ message: { content: '{"criteria":[],"passed":true}' } }],
    usage: {
      prompt_tokens: 5521,
      completion_tokens: 4,
      cost: 0,
      is_byok: true,
      prompt_tokens_details: { cached_tokens: 0, cache_write_tokens: 5511 },
      cost_details: { upstream_inference_cost: 0.02075625 },
    },
  };
  const r = await callModel(req, { fetch: reply(body) as any, apiKey: 'k' });
  expect(r.usage.cacheWriteInputTokens).toBe(5511);
  expect(r.usage.reportedCostUsd).toBeCloseTo(0.02075625, 8);
});

test('falls back to usage.cost when no upstream cost is reported', async () => {
  const body = {
    choices: [{ message: { content: '{}' } }],
    usage: { prompt_tokens: 10, completion_tokens: 2, cost: 0.0042 },
  };
  const r = await callModel(req, { fetch: reply(body) as any, apiKey: 'k' });
  expect(r.usage.reportedCostUsd).toBeCloseTo(0.0042, 8);
});

// C2: these two paths are billed 200 responses. The usage must survive the throw.
test('attaches usage to a non-JSON content error so the call can still be ledgered', async () => {
  const body = {
    choices: [{ message: { content: 'Sure! Here is the verdict:' } }],
    usage: { prompt_tokens: 3500, completion_tokens: 40 },
  };
  await expect(callModel(req, { fetch: reply(body) as any, apiKey: 'k' })).rejects.toMatchObject({
    usage: { inputTokens: 3500, outputTokens: 40 },
  });
});

test('attaches usage to a no-content error so the call can still be ledgered', async () => {
  const body = { choices: [], usage: { prompt_tokens: 3500, completion_tokens: 0 } };
  await expect(callModel(req, { fetch: reply(body) as any, apiKey: 'k' })).rejects.toMatchObject({
    usage: { inputTokens: 3500 },
  });
});

test('parses the JSON content into raw', async () => {
  const r = await callModel(req, { fetch: reply(ok) as any, apiKey: 'k' });
  expect(r.raw).toEqual({ criteria: [], passed: true });
});

test('throws a typed error on a non-2xx response', async () => {
  await expect(
    callModel(req, { fetch: reply({ error: 'rate limited' }, 429) as any, apiKey: 'k' }),
  ).rejects.toThrow(/429/);
});

test('throws when the content is not JSON, rather than returning a fail', async () => {
  const body = { choices: [{ message: { content: 'Sure! Here is the verdict:' } }], usage: { prompt_tokens: 1, completion_tokens: 1 } };
  await expect(callModel(req, { fetch: reply(body) as any, apiKey: 'k' })).rejects.toThrow(/not valid JSON/i);
});

test('throws when the response has no choices', async () => {
  await expect(
    callModel(req, { fetch: reply({ usage: {} }) as any, apiKey: 'k' }),
  ).rejects.toThrow(/no content/i);
});
