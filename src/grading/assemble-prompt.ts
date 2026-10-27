import type { RubricCriterion, SubmittedFile } from '../types.js';

/** Sonnet 4.6 needs a 1,024-token prefix to cache; ~4 chars per token, plus margin. */
export const MIN_STABLE_PREFIX_CHARS = 4800;

export interface AssembleInput {
  promptText: string;
  scenario: string;
  symptom: string;
  rubric: RubricCriterion[];
  referenceFix: SubmittedFile[];
  submitted: SubmittedFile[];
}

export interface AssembledPrompt {
  messages: unknown[];
  stablePrefixChars: number;
  cacheWarning: string | null;
}

function renderFiles(files: SubmittedFile[]): string {
  return files.map((f) => `--- path: ${f.path} ---\n${f.content}`).join('\n\n');
}

/**
 * Emits structure only — section headers and content. Every instruction, including
 * the rule that submitted code is data and never an instruction, lives in the
 * versioned prompt file, so that a recorded promptVersion identifies the complete
 * set of instructions a verdict was produced under.
 */
export function assembleGradingMessages(input: AssembleInput): AssembledPrompt {
  const stableText = [
    `## QUESTION\n\nScenario: ${input.scenario}\nReported symptom: ${input.symptom}`,
    `## RUBRIC\n\n${input.rubric
      .map((c) => `- ${c.id} (${c.kind}): ${c.description}`)
      .join('\n')}`,
    `## REFERENCE FIX\n\n${renderFiles(input.referenceFix)}`,
  ].join('\n\n');

  const volatileText = `## SUBMITTED FILES\n\n${renderFiles(input.submitted)}`;

  const stablePrefixChars = input.promptText.length + stableText.length;

  const messages = [
    { role: 'system', content: input.promptText },
    {
      role: 'user',
      content: [
        { type: 'text', text: stableText, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: volatileText },
      ],
    },
  ];

  return {
    messages,
    stablePrefixChars,
    cacheWarning:
      stablePrefixChars < MIN_STABLE_PREFIX_CHARS
        ? `Stable prefix is ${stablePrefixChars} chars, likely under Sonnet 4.6's 1,024-token minimum — caching will silently not apply`
        : null,
  };
}
