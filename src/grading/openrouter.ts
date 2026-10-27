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

export class ModelCallError extends Error {}

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

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      // UNVERIFIED against a live response: no API key available at implementation
      // time. If this field is named differently, cached tokens silently read as 0
      // and every cost figure in the eval is wrong. Confirm before the baseline run.
      prompt_tokens_details?: { cached_tokens?: number };
    };
  };

  const content = body.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new ModelCallError('OpenRouter response had no content');
  }

  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    throw new ModelCallError(`Model content was not valid JSON: ${content.slice(0, 200)}`);
  }

  return {
    raw,
    latencyMs,
    usage: {
      inputTokens: body.usage?.prompt_tokens ?? 0,
      outputTokens: body.usage?.completion_tokens ?? 0,
      cachedInputTokens: body.usage?.prompt_tokens_details?.cached_tokens ?? 0,
    },
  };
}
