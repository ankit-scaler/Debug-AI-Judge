// src/terminal/parse-command.ts
export type PlatformCommand =
  | { kind: 'run' }
  | { kind: 'git-diff' }
  | { kind: 'npm-test' }
  | { kind: 'ls' }
  | { kind: 'cat'; path: string }
  | { kind: 'clear' }
  | { kind: 'help' }
  | { kind: 'question'; id: string; args: string };

export type ParseResult = { ok: true; command: PlatformCommand } | { ok: false; message: string };

export function parseCommand(
  input: string,
  declared: { id: string; command: string; help: string }[],
  hasTests: boolean,
): ParseResult {
  const trimmed = input.trim();
  if (trimmed === '') return { ok: false, message: '' };

  if (trimmed === 'npm run dev') return { ok: true, command: { kind: 'run' } };
  if (trimmed === 'git diff') return { ok: true, command: { kind: 'git-diff' } };
  if (trimmed === 'npm test' || trimmed === 'npm run test') {
    if (!hasTests) return { ok: false, message: 'npm test: no test script found' };
    return { ok: true, command: { kind: 'npm-test' } };
  }
  if (trimmed === 'ls') return { ok: true, command: { kind: 'ls' } };
  if (trimmed === 'clear') return { ok: true, command: { kind: 'clear' } };
  if (trimmed === 'help') return { ok: true, command: { kind: 'help' } };
  if (trimmed === 'cat') return { ok: false, message: 'usage: cat <path>' };
  if (trimmed.startsWith('cat ')) {
    return { ok: true, command: { kind: 'cat', path: trimmed.slice(4).trim() } };
  }

  const match = declared.find((d) => d.command === trimmed);
  if (match) return { ok: true, command: { kind: 'question', id: match.id, args: '' } };

  const [cmd] = trimmed.split(/\s+/);
  return { ok: false, message: `command not found: ${cmd}` };
}
