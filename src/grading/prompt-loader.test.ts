import { expect, test } from 'vitest';
import { loadPrompt } from './prompt-loader';

test('loads a prompt and reports its version', async () => {
  const p = await loadPrompt('authoring', 'v1');
  expect(p.version).toBe('v1');
  expect(p.name).toBe('authoring');
  expect(p.text).toContain('=== PROMPT STARTS ===');
});

test('rejects a missing version rather than falling back', async () => {
  await expect(loadPrompt('authoring', 'v99')).rejects.toThrow(/v99/);
});

test('rejects a version that is not vN, to keep paths unguessable', async () => {
  await expect(loadPrompt('authoring', '../../etc/passwd')).rejects.toThrow(
    /invalid version/i,
  );
});
