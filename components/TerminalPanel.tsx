'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './solve.module.css';
import { parseCommand, type PlatformCommand } from '@/src/terminal/parse-command';
import { diffLines } from '@/src/terminal/diff-lines';

export interface TerminalLine {
  kind: 'input' | 'output' | 'error';
  text: string;
}

export interface TerminalCommandMeta {
  id: string;
  command: string;
  help: string;
}

/** Same shape as SolveScreen's LearnerFile -- `question.files`, which carries visibility. */
export interface TerminalFile {
  path: string;
  content: string;
  visibility: 'editable' | 'readonly' | 'hidden';
}

export interface TerminalPanelProps {
  lines: TerminalLine[];
  onLines: (update: (prev: TerminalLine[]) => TerminalLine[]) => void;
  busy: boolean;
  declaredCommands: TerminalCommandMeta[];
  hasTests: boolean;
  /** question.files (NOT SolveScreen's `files`, which has no visibility field). */
  files: TerminalFile[];
  originals: Record<string, string>;
  contents: Record<string, string>;
  onRun: () => void;
  onNpmTest: () => void;
  onQuestionCommand: (id: string, args: string) => void;
}

export function TerminalPanel({
  lines,
  onLines,
  busy,
  declaredCommands,
  hasTests,
  files,
  originals,
  contents,
  onRun,
  onNpmTest,
  onQuestionCommand,
}: TerminalPanelProps) {
  const [input, setInput] = useState('');
  const inputRowRef = useRef<HTMLDivElement>(null);

  // Keep the prompt in view on every change to `lines` -- including output
  // that arrives later from the iframe (npm test results, repro reports),
  // not just local echoes.
  useEffect(() => {
    inputRowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);

  function append(...newLines: TerminalLine[]) {
    onLines((prev) => [...prev, ...newLines]);
  }

  function runCommand(command: PlatformCommand) {
    switch (command.kind) {
      case 'run':
        onRun();
        return;
      case 'npm-test':
        onNpmTest();
        return;
      case 'question':
        onQuestionCommand(command.id, command.args);
        return;
      case 'git-diff': {
        const out: TerminalLine[] = [];
        for (const f of files) {
          if (f.visibility === 'hidden') continue;
          const before = originals[f.path] ?? f.content;
          const after = contents[f.path] ?? f.content;
          if (before === after) continue;
          out.push({ kind: 'output', text: `diff --git a/${f.path} b/${f.path}` });
          for (const hunk of diffLines(before, after)) {
            out.push({ kind: 'output', text: `@@ -${hunk.oldStart} +${hunk.newStart} @@` });
            for (const d of hunk.lines) {
              out.push({ kind: 'output', text: (d.type === 'added' ? '+ ' : '- ') + d.text });
            }
          }
        }
        append(...(out.length > 0 ? out : [{ kind: 'output' as const, text: '(no changes)' }]));
        return;
      }
      case 'ls':
        append(
          ...files
            .filter((f) => f.visibility !== 'hidden')
            .map((f): TerminalLine => ({ kind: 'output', text: f.path })),
        );
        return;
      case 'cat': {
        const file = files.find((f) => f.path === command.path && f.visibility !== 'hidden');
        if (!file) {
          append({ kind: 'error', text: `cat: ${command.path}: No such file or directory` });
          return;
        }
        append({ kind: 'output', text: contents[file.path] ?? file.content });
        return;
      }
      case 'clear':
        onLines(() => []);
        return;
      case 'help':
        append(
          { kind: 'output', text: `npm run dev, ${hasTests ? 'npm test, ' : ''}git diff, ls, cat <path>, clear, help` },
          ...declaredCommands.map((d): TerminalLine => ({ kind: 'output', text: `${d.command} — ${d.help}` })),
        );
        return;
    }
  }

  function submit() {
    const raw = input;
    setInput('');
    if (raw.trim() === '') return;
    const result = parseCommand(raw, declaredCommands, hasTests);
    if (result.ok && result.command.kind === 'clear') {
      runCommand(result.command); // clear wipes everything, its own echo included
      return;
    }
    append({ kind: 'input', text: raw });
    if (!result.ok) {
      if (result.message) append({ kind: 'error', text: result.message });
      return;
    }
    runCommand(result.command);
  }

  return (
    <div className={styles.terminal} data-testid="terminal-panel">
      <div className={styles.terminalScrollback}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${styles.terminalLine} mono ${
              line.kind === 'input' ? styles.terminalInputLine : line.kind === 'error' ? styles.terminalError : ''
            }`}
          >
            {line.kind === 'input' ? '$ ' : ''}
            {line.text}
          </div>
        ))}
      </div>
      <div ref={inputRowRef} className={`${styles.terminalInputRow} mono`}>
        {busy ? <span className={styles.spinner} aria-hidden="true" /> : <span aria-hidden="true">$</span>}
        <input
          className={`${styles.terminalInput} mono`}
          value={input}
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder={busy ? 'running…' : 'type a command, or help'}
          aria-label="Terminal input"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
