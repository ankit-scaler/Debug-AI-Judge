'use client';

import { useCallback, useMemo, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { DevToolsPanel, type BottomTab } from './DevToolsPanel';
import { FileTree } from './FileTree';
import { PreviewFrame, type ConsoleLine, type NetworkEntry } from './PreviewFrame';
import type { SubmitResult } from './ResultCard';
import styles from './solve.module.css';
import { useTheme } from './useTheme';
import { bundlePreview, type PreviewBuildError } from '@/src/preview/bundler';

export interface LearnerFile {
  path: string;
  content: string;
  visibility: 'editable' | 'readonly' | 'hidden';
}

export interface LearnerQuestionProps {
  slug: string;
  title: string;
  company: string;
  difficulty: string;
  tags: string[];
  entry: string;
  handlersPath?: string;
  scenario: string;
  symptom: string;
  files: LearnerFile[];
}

type SubmitStage = 'checking' | 'grading' | null;

export function SolveScreen({ question }: { question: LearnerQuestionProps }) {
  const originals = useMemo(
    () => Object.fromEntries(question.files.map((f) => [f.path, f.content])),
    [question.files],
  );
  const visibility = useMemo(
    () => Object.fromEntries(question.files.map((f) => [f.path, f.visibility])),
    [question.files],
  );

  const [contents, setContents] = useState<Record<string, string>>(originals);
  const [activePath, setActivePath] = useState(
    question.files.find((f) => f.visibility === 'editable')?.path ?? question.files[0]!.path,
  );
  const [rightTab, setRightTab] = useState<'code' | 'preview'>('preview');
  const [bottomTab, setBottomTab] = useState<BottomTab>('console');
  const [runToken, setRunToken] = useState(1);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [network, setNetwork] = useState<NetworkEntry[]>([]);
  const [building, setBuilding] = useState(false);
  const [buildErrors, setBuildErrors] = useState<PreviewBuildError[]>([]);
  const [stage, setStage] = useState<SubmitStage>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [theme, toggleTheme] = useTheme();

  const files = useMemo(
    () => question.files.map((f) => ({ path: f.path, content: contents[f.path] ?? f.content })),
    [question.files, contents],
  );

  const dirtyPaths = useMemo(
    () =>
      new Set(
        question.files.filter((f) => contents[f.path] !== originals[f.path]).map((f) => f.path),
      ),
    [question.files, contents, originals],
  );
  const dirty = dirtyPaths.size > 0;

  const onConsole = useCallback((line: ConsoleLine) => {
    setConsoleLines((prev) => [...prev, line]);
  }, []);
  const onNetwork = useCallback((entry: NetworkEntry) => {
    setNetwork((prev) => [...prev, entry]);
  }, []);
  const onStatus = useCallback(
    (status: { building: boolean; errors: PreviewBuildError[] }) => {
      setBuilding(status.building);
      setBuildErrors(status.errors);
    },
    [],
  );

  const run = useCallback(() => {
    setConsoleLines([]);
    setNetwork([]);
    setRightTab('preview');
    setRunToken((n) => n + 1);
  }, []);

  const reset = useCallback(() => {
    setContents(originals);
    setConsoleLines([]);
    setNetwork([]);
    setResult(null);
    setRunToken((n) => n + 1);
  }, [originals]);

  const submit = useCallback(async () => {
    setBottomTab('results');
    setResult(null);

    // Stage one is a real local build with the same bundler the server's gate
    // uses, so code that cannot compile never costs a paid grading call.
    setStage('checking');
    const bundle = await bundlePreview({
      files,
      entry: question.entry,
      handlersPath: question.handlersPath,
    });
    if (!bundle.ok) {
      setStage(null);
      setResult({ status: 'build_failed', errors: bundle.errors });
      return;
    }

    setStage('grading');
    try {
      const response = await fetch(`/api/attempts/${question.slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Only editable files are sent. The server rejects anything else.
          files: question.files
            .filter((f) => f.visibility === 'editable')
            .map((f) => ({ path: f.path, content: contents[f.path] ?? f.content })),
        }),
      });
      setResult((await response.json()) as SubmitResult);
    } catch (err) {
      setResult({
        status: 'system_error',
        message: `Could not reach the grader: ${(err as Error).message}`,
      });
    } finally {
      setStage(null);
    }
  }, [contents, files, question]);

  const busy = stage !== null;
  const activeReadOnly = visibility[activePath] !== 'editable';

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <span className={styles.brand}>
          Debugging<span className={styles.brandAccent}>Lab</span>
        </span>
        <span className={styles.spacer} />
        <button className={styles.btn} onClick={run} disabled={busy || building}>
          {building ? <span className={styles.spinner} /> : null}
          {building ? 'Building' : 'Run'}
        </button>
        <button className={styles.btn} onClick={reset} disabled={busy || !dirty}>
          Reset
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => void submit()}
          disabled={busy}
        >
          {busy ? <span className={styles.spinner} /> : null}
          {stage === 'checking' ? 'Checking build' : stage === 'grading' ? 'Grading' : 'Submit'}
        </button>
        <button className={styles.btn} onClick={toggleTheme} aria-label="Toggle colour theme">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <div className={styles.body}>
        <aside className={styles.left}>
          <p className={styles.company}>{question.company}</p>
          <h1 className={styles.title}>{question.title}</h1>

          <p className={styles.sectionLabel}>Scenario</p>
          <p className={styles.prose}>{question.scenario}</p>

          <p className={styles.sectionLabel}>Reported symptom</p>
          <p className={styles.symptom}>{question.symptom}</p>

          <div className={styles.tagRow}>
            <span className={styles.tag}>{question.difficulty}</span>
            {question.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        </aside>

        <main className={styles.right}>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={rightTab === 'code'}
              className={`${styles.tab} ${rightTab === 'code' ? styles.tabActive : ''}`}
              onClick={() => setRightTab('code')}
            >
              Code
            </button>
            <button
              role="tab"
              aria-selected={rightTab === 'preview'}
              className={`${styles.tab} ${rightTab === 'preview' ? styles.tabActive : ''}`}
              onClick={() => setRightTab('preview')}
            >
              Preview
            </button>
          </div>

          {rightTab === 'code' ? (
            <div className={styles.codeSplit}>
              <FileTree
                files={question.files}
                activePath={activePath}
                dirtyPaths={dirtyPaths}
                onSelect={setActivePath}
              />
              <div className={styles.editorPane}>
                <div className={styles.editorPath}>
                  <span className={styles.editorPathActive}>{activePath}</span>
                  {activeReadOnly ? (
                    <span className={styles.readOnlyNote}>read-only</span>
                  ) : null}
                </div>
                <div className={styles.paneArea}>
                  <CodeEditor
                    path={activePath}
                    value={contents[activePath] ?? ''}
                    readOnly={activeReadOnly}
                    theme={theme}
                    onChange={(value) =>
                      setContents((prev) => ({ ...prev, [activePath]: value }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.paneArea}>
              <PreviewFrame
                files={files}
                entry={question.entry}
                handlersPath={question.handlersPath}
                runToken={runToken}
                onConsole={onConsole}
                onNetwork={onNetwork}
                onStatus={onStatus}
              />
              {building ? (
                <div className={styles.overlay}>
                  <span className={styles.spinner} /> Bundling your app…
                </div>
              ) : null}
              {buildErrors.length > 0 ? (
                <div className={`${styles.buildErrors} mono`}>
                  {buildErrors.map((e, i) => (
                    <div key={i}>
                      {e.file}:{e.line}:{e.column} — {e.text}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <DevToolsPanel
            tab={bottomTab}
            onTabChange={setBottomTab}
            consoleLines={consoleLines}
            network={network}
            result={result}
          />
        </main>
      </div>
    </div>
  );
}
