import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface LoadedPrompt {
  name: string;
  version: string;
  text: string;
}

const VERSION_RE = /^v\d+$/;
const PROMPT_ROOT = join(process.cwd(), 'prompts');

export async function loadPrompt(
  name: string,
  version: string,
): Promise<LoadedPrompt> {
  if (!VERSION_RE.test(version)) {
    throw new Error(`Invalid version "${version}": expected vN`);
  }
  if (!/^[a-z-]+$/.test(name)) {
    throw new Error(`Invalid prompt name "${name}"`);
  }
  const path = join(PROMPT_ROOT, name, `${version}.md`);
  try {
    const text = await readFile(path, 'utf8');
    return { name, version, text };
  } catch {
    throw new Error(`Prompt not found: ${name}/${version} at ${path}`);
  }
}
