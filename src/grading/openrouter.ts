import type { Usage } from '../types.js';

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export interface ModelRequest {
  model: string;
  messages: unknown[];
  schemaName: string;
  schema: object;
}

export interface ModelResponse {
  raw: unknown;
  usage: Usage;
  latencyMs: number;
}

export class ModelCallError extends Error {
  /**
   * Usage from a response that was billed but unusable. A 200 that contains prose
   * instead of JSON still costs money, and a call that never reaches the ledger
   * lets month-to-date spend understate and the ceiling be walked past.
   */
  readonly usage?: Usage;
  readonly latencyMs?: number;

  constructor(message: string, usage?: Usage, latencyMs?: number) {
    super(message);
    this.name = 'ModelCallError';
    this.usage = usage;
    this.latencyMs = latencyMs;
  }
}

export async function callModel(
  req: ModelRequest,
  deps: { fetch: typeof fetch; apiKey: string },
): Promise<ModelResponse> {
  const started = Date.now();
  const res = await deps.fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${deps.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model,
      messages: req.messages,
      response_format: {
        type: 'json_schema',
        json_schema: { name: req.schemaName, strict: true, schema: req.schema },
      },
      // Structured-output support is per endpoint on OpenRouter; without this a
      // request can be routed to an endpoint that ignores the schema entirely.
      provider: { require_parameters: true },
    }),
  });
  const latencyMs = Date.now() - started;

  if (!res.ok) {
    throw new ModelCallError(`OpenRouter returned ${res.status}: ${await res.text()}`);
  }

  // Field names and semantics verified against a live OpenRouter response on
  // 2026-10-27: cached_tokens and cache_write_tokens are both subsets of
  // prompt_tokens, and cost_details.upstream_inference_cost is the real spend on
  // a BYOK key (usage.cost is 0 there).
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      cost?: number;
      prompt_tokens_details?: { cached_tokens?: number; cache_write_tokens?: number };
      cost_details?: { upstream_inference_cost?: number };
    };
  };

  const usage: Usage = {
    inputTokens: body.usage?.prompt_tokens ?? 0,
    outputTokens: body.usage?.completion_tokens ?? 0,
    cachedInputTokens: body.usage?.prompt_tokens_details?.cached_tokens ?? 0,
    cacheWriteInputTokens: body.usage?.prompt_tokens_details?.cache_write_tokens ?? 0,
    reportedCostUsd:
      body.usage?.cost_details?.upstream_inference_cost ?? body.usage?.cost ?? null,
  };

  const content = body.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new ModelCallError('OpenRouter response had no content', usage, latencyMs);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    throw new ModelCallError(
      `Model content was not valid JSON: ${content.slice(0, 200)}`,
      usage,
      latencyMs,
    );
  }

  return { raw, latencyMs, usage };
}
