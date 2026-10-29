'use client';

import { Editor, loader } from '@monaco-editor/react';
import styles from './solve.module.css';

// Monaco's own AMD loader, pointed at the copy self-hosted by
// scripts/build-preview-vendor.mjs. Avoids the CDN that @monaco-editor/react
// defaults to, and avoids bundler-specific worker plumbing entirely.
loader.config({ paths: { vs: '/monaco/vs' } });

function languageFor(path: string): string {
  if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.md')) return 'markdown';
  return 'plaintext';
}

export interface CodeEditorProps {
  path: string;
  value: string;
  readOnly: boolean;
  theme: 'light' | 'dark';
  onChange: (value: string) => void;
}

export function CodeEditor({ path, value, readOnly, theme, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      // `path` gives each file its own model, so undo history and cursor position
      // survive switching tabs.
      path={path}
      language={languageFor(path)}
      value={value}
      theme={theme === 'dark' ? 'vs-dark' : 'vs'}
      loading={<div className={styles.overlay}>Loading editor…</div>}
      onChange={(next) => onChange(next ?? '')}
      options={{
        readOnly,
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'var(--font-code), ui-monospace, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        renderWhitespace: 'selection',
        padding: { top: 12, bottom: 12 },
      }}
    />
  );
}
