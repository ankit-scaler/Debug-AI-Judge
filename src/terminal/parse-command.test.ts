// src/terminal/parse-command.test.ts
import { describe, expect, test } from 'vitest';
import { parseCommand } from './parse-command';

const declared = [
  { id: 'repro-dup', command: 'npm run repro -- dup', help: 'reproduce duplicate cart rows' },
  { id: 'db-inspect', command: 'npm run db:inspect', help: 'print the current tables' },
];

describe('parseCommand', () => {
  test('matches a platform-native command exactly', () => {
    expect(parseCommand('npm run dev', [], true)).toEqual({ ok: true, command: { kind: 'run' } });
  });

  test('matches git diff', () => {
    expect(parseCommand('git diff', [], true)).toEqual({ ok: true, command: { kind: 'git-diff' } });
  });

  test('npm test is only offered when the question has a test suite', () => {
    expect(parseCommand('npm test', [], false)).toEqual({
      ok: false,
      message: 'npm test: no test script found',
    });
    expect(parseCommand('npm test', [], true)).toEqual({ ok: true, command: { kind: 'npm-test' } });
  });

  test('npm run test is accepted as an alias for npm test', () => {
    // Every question-declared command already uses the "npm run <x>" form
    // (npm run repro -- dup, npm run db:inspect), and npm run dev is the
    // platform-native form for 'run' too -- npm test being the one bare
    // exception is a trap, not a feature, so npm run test works the same.
    expect(parseCommand('npm run test', [], false)).toEqual({
      ok: false,
      message: 'npm test: no test script found',
    });
    expect(parseCommand('npm run test', [], true)).toEqual({ ok: true, command: { kind: 'npm-test' } });
  });

  test('matches a question-declared command by its exact command string', () => {
    expect(parseCommand('npm run repro -- dup', declared, true)).toEqual({
      ok: true,
      command: { kind: 'question', id: 'repro-dup', args: '' },
    });
  });

  test('ls needs no arguments', () => {
    expect(parseCommand('ls', [], true)).toEqual({ ok: true, command: { kind: 'ls' } });
  });

  test('cat requires a path argument', () => {
    expect(parseCommand('cat src/App.jsx', [], true)).toEqual({
      ok: true,
      command: { kind: 'cat', path: 'src/App.jsx' },
    });
    expect(parseCommand('cat', [], true)).toEqual({
      ok: false,
      message: 'usage: cat <path>',
    });
  });

  test('clear and help need no arguments', () => {
    expect(parseCommand('clear', [], true)).toEqual({ ok: true, command: { kind: 'clear' } });
    expect(parseCommand('help', [], true)).toEqual({ ok: true, command: { kind: 'help' } });
  });

  test('an unrecognized command reports command-not-found, shell-style', () => {
    expect(parseCommand('curl example.com', [], true)).toEqual({
      ok: false,
      message: 'command not found: curl',
    });
  });

  test('blank input is not an error, just nothing to do', () => {
    expect(parseCommand('', [], true)).toEqual({ ok: false, message: '' });
    expect(parseCommand('   ', [], true)).toEqual({ ok: false, message: '' });
  });
});
