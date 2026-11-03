'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { DevToolsPanel, type BottomTab, type LogLine } from './DevToolsPanel';
import { FileTree } from './FileTree';
import {
  PreviewFrame,
  type ConsoleLine,
  type NetworkEntry,
  type PreviewFrameHandle,
  type TerminalOutput,
} from './PreviewFrame';
import type { SubmitResult } from './ResultCard';
import type { TerminalLine } from './TerminalPanel';
import styles from './solve.module.css';
import { useTheme } from './useTheme';
import { bundlePreview, type PreviewBuildError } from '@/src/preview/bundler';
import { bundleTests } from '@/src/preview/test-bundler';
import type { TestResult } from '@/src/testing/browser-test-harness';

/** Matches the Submit route's own executeTests() budget (20000ms). */
const TERMINAL_COMMAND_TIMEOUT_MS = 20000;

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
  gradingMode?: 'llm' | 'tests';
  testEntry?: string;
  terminalCommands?: { id: string; command: string; help: string }[];
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
  const [bottomTab, setBottomTab] = useState<BottomTab>('logs');
  const [runToken, setRunToken] = useState(1);
  const [logLines, setLogLines] = useState<LogLine[]>([]);
  const [network, setNetwork] = useState<NetworkEntry[]>([]);
  const [building, setBuilding] = useState(false);
  const [buildErrors, setBuildErrors] = useState<PreviewBuildError[]>([]);
  // False from the moment a run starts until code actually reaches a loaded,
  // listening iframe. Distinct from `building`: the JS bundle usually compiles
  // in under a second, but the iframe itself -- on a tab that has never run
  // esbuild-wasm before -- can take far longer to finish its own one-time
  // engine warm-up. Without tracking this separately, the preview sat blank
  // with no loading indicator for however long that second phase took.
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [stage, setStage] = useState<SubmitStage>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [noMoreHints, setNoMoreHints] = useState(false);
  const [solutionFiles, setSolutionFiles] = useState<{ path: string; content: string }[] | null>(
    null,
  );
  const [solutionLoading, setSolutionLoading] = useState(false);
  // Two clicks required: the first arms it and names the consequence, the
  // second actually spends it. One accidental click must never zero a
  // learner's score -- see D24.
  const [giveUpArmed, setGiveUpArmed] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const previewRef = useRef<PreviewFrameHandle>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [terminalBusy, setTerminalBusy] = useState(false);
  // Bookkeeping for the one in-flight terminal command (the input is
  // disabled while one runs, so there is never more than one):
  const busyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commandSeqRef = useRef(0); // source of runIds for terminal-run
  const activeRunIdRef = useRef<number | null>(null); // terminal-output we are waiting for
  const testsPendingRef = useRef(false); // test-results we are waiting for
  const terminalGenRef = useRef(0); // bumped on cancel; an await that resumes into a newer generation drops its result

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
    setLogLines((prev) => [...prev, { ...line, source: 'client' }]);
  }, []);
  const onServerLog = useCallback((line: ConsoleLine) => {
    setLogLines((prev) => [...prev, { ...line, source: 'server' }]);
  }, []);
  const onNetwork = useCallback((entry: NetworkEntry) => {
    setNetwork((prev) => [...prev, entry]);
  }, []);
  const onStatus = useCallback(
    (status: { building: boolean; errors: PreviewBuildError[] }) => {
      setBuilding(status.building);
      setBuildErrors(status.errors);
      if (status.errors.length > 0) setPreviewLoaded(true); // nothing more to wait for
    },
    [],
  );
  const onPreviewLoaded = useCallback(() => setPreviewLoaded(true), []);

  const appendTerminal = useCallback((...lines: TerminalLine[]) => {
    setTerminalLines((prev) => [...prev, ...lines]);
  }, []);

  // Ends the current terminal command normally (its result arrived).
  const finishCommand = useCallback(() => {
    if (busyTimerRef.current !== null) clearTimeout(busyTimerRef.current);
    busyTimerRef.current = null;
    activeRunIdRef.current = null;
    testsPendingRef.current = false;
    setTerminalBusy(false);
  }, []);

  // Abandons the current terminal command (timeout, Run, Reset): any result
  // that still arrives for it afterwards is ignored, and a hidden test
  // iframe is torn down. Without this, terminalBusy could stay true forever
  // -- e.g. Run remounting the iframe mid-command, a command posted before
  // the new iframe generation attached its listener, or a test file
  // throwing before the harness could report.
  const cancelCommand = useCallback(() => {
    terminalGenRef.current += 1;
    previewRef.current?.cancelRunTests();
    finishCommand();
  }, [finishCommand]);

  const startCommand = useCallback(
    (label: string) => {
      setTerminalBusy(true);
      if (busyTimerRef.current !== null) clearTimeout(busyTimerRef.current);
      busyTimerRef.current = setTimeout(() => {
        cancelCommand();
        appendTerminal({
          kind: 'error',
          text: `${label}: no result after ${TERMINAL_COMMAND_TIMEOUT_MS / 1000}s -- gave up. Press Run and try again.`,
        });
      }, TERMINAL_COMMAND_TIMEOUT_MS);
    },
    [appendTerminal, cancelCommand],
  );

  const onTerminalOutput = useCallback(
    (output: TerminalOutput) => {
      if (output.runId !== activeRunIdRef.current) return; // stale: timed out or cancelled
      appendTerminal({ kind: output.ok ? 'output' : 'error', text: output.text });
      finishCommand();
    },
    [appendTerminal, finishCommand],
  );

  const onTestResults = useCallback(
    (tests: TestResult[]) => {
      if (!testsPendingRef.current) return; // stale: timed out or cancelled
      const passedCount = tests.filter((t) => t.passed).length;
      appendTerminal(
        ...tests.map(
          (t): TerminalLine => ({
            kind: t.passed ? 'output' : 'error',
            text: `${t.passed ? 'PASS' : 'FAIL'}  ${t.name}${t.error ? `\n      ${t.error}` : ''}`,
          }),
        ),
        {
          kind: passedCount === tests.length ? 'output' : 'error',
          text: `Tests: ${passedCount} passed, ${tests.length - passedCount} failed, ${tests.length} total`,
        },
      );
      finishCommand();
    },
    [appendTerminal, finishCommand],
  );

  const run = useCallback(() => {
    cancelCommand();
    appendTerminal({ kind: 'output', text: '--- preview restarted (npm run dev) ---' });
    setLogLines([]);
    setNetwork([]);
    setRightTab('preview');
    setPreviewLoaded(false);
    setRunToken((n) => n + 1);
  }, [appendTerminal, cancelCommand]);

  const reset = useCallback(() => {
    cancelCommand();
    appendTerminal({ kind: 'output', text: '--- files reset to the original broken code; preview restarted ---' });
    setContents(originals);
    setLogLines([]);
    setNetwork([]);
    setResult(null);
    setPreviewLoaded(false);
    setRunToken((n) => n + 1);
  }, [originals, appendTerminal, cancelCommand]);

  const hasTests = question.gradingMode === 'tests' && !!question.testEntry;

  const onTerminalNpmTest = useCallback(async () => {
    const testEntry = question.testEntry;
    if (!testEntry) return; // unreachable: parseCommand only offers npm test when hasTests
    if (buildErrors.length > 0) {
      appendTerminal({ kind: 'error', text: 'The app failed to build -- fix the build errors, then Run.' });
      return;
    }
    if (!previewLoaded) {
      appendTerminal({ kind: 'error', text: 'The preview is still starting -- wait for it to load, then try again.' });
      return;
    }
    // previewLoaded true means bundlePreview already called ensureInitialised()
    // and it resolved -- esbuild-wasm's cold init (documented up to ~20s) is
    // already paid for. Without this gate, npm test could call startCommand
    // (arming the 20s TERMINAL_COMMAND_TIMEOUT_MS) and then spend most or all
    // of that budget inside bundleTests's own await deps.init(), timing out on
    // a cold init rather than on a real hang.
    const gen = terminalGenRef.current;
    startCommand('npm test');
    testsPendingRef.current = true;
    let sent = false;
    try {
      // Bundled fresh from the CURRENT editor contents every time -- never
      // the last Run's bundle -- so an edit that was never Run is tested.
      const bundle = await bundleTests({ files, testEntry, handlersPath: question.handlersPath });
      if (gen !== terminalGenRef.current) return; // cancelled while bundling
      if (!bundle.ok) {
        appendTerminal(
          { kind: 'error', text: 'npm test: the test bundle failed to build' },
          ...bundle.errors.map((e): TerminalLine => ({ kind: 'error', text: `${e.file}:${e.line}:${e.column} — ${e.text}` })),
        );
        return;
      }
      const handle = previewRef.current;
      if (!handle) throw new Error('the preview is not mounted');
      handle.sendRunTests(bundle.code);
      sent = true; // still busy: onTestResults (or the timeout) ends it
    } catch (err) {
      if (gen === terminalGenRef.current) {
        appendTerminal({ kind: 'error', text: `npm test: ${(err as Error).message}` });
      }
    } finally {
      if (!sent && gen === terminalGenRef.current) finishCommand();
    }
  }, [
    files,
    question.testEntry,
    question.handlersPath,
    buildErrors.length,
    previewLoaded,
    startCommand,
    appendTerminal,
    finishCommand,
  ]);

  const onTerminalQuestionCommand = useCallback(
    (id: string, args: string) => {
      if (buildErrors.length > 0) {
        appendTerminal({ kind: 'error', text: 'The app failed to build -- fix the build errors, then Run.' });
        return;
      }
      if (!previewLoaded) {
        appendTerminal({ kind: 'error', text: 'The preview is still starting -- wait for it to load, then try again.' });
        return;
      }
      const runId = ++commandSeqRef.current;
      activeRunIdRef.current = runId;
      startCommand(id);
      previewRef.current?.sendTerminalCommand(id, args, runId);
    },
    [buildErrors.length, previewLoaded, appendTerminal, startCommand],
  );

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

  const passed =
    result !== null &&
    (result.status === 'graded' || result.status === 'tests_ran') &&
    result.passed;

  const showNextHint = useCallback(async () => {
    setHintsLoading(true);
    try {
      const response = await fetch(
        `/api/questions/${question.slug}/hints?index=${revealedHints.length}`,
      );
      if (!response.ok) {
        setNoMoreHints(true);
        return;
      }
      const data = (await response.json()) as { hint: string; hasMore: boolean };
      setRevealedHints((prev) => [...prev, data.hint]);
      if (!data.hasMore) setNoMoreHints(true);
    } finally {
      setHintsLoading(false);
    }
  }, [question.slug, revealedHints.length]);

  const viewSolution = useCallback(async () => {
    setSolutionLoading(true);
    try {
      const response = await fetch(`/api/questions/${question.slug}/solution`);
      const data = (await response.json()) as { files: { path: string; content: string }[] };
      setSolutionFiles(data.files);
      setBottomTab('solution');
    } finally {
      setSolutionLoading(false);
    }
  }, [question.slug]);

  const handleGiveUp = useCallback(async () => {
    if (!giveUpArmed) {
      setGiveUpArmed(true);
      return;
    }
    setSolutionLoading(true);
    try {
      const response = await fetch(`/api/attempts/${question.slug}/give-up`, { method: 'POST' });
      const data = (await response.json()) as { files: { path: string; content: string }[] };
      setSolutionFiles(data.files);
      setBottomTab('solution');
    } finally {
      setSolutionLoading(false);
      setGiveUpArmed(false);
    }
  }, [giveUpArmed, question.slug]);

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

          <p className={styles.sectionLabel}>Hints</p>
          {revealedHints.map((hint, i) => (
            <p key={i} className={styles.hintText}>
              {i + 1}. {hint}
            </p>
          ))}
          {noMoreHints ? (
            <p className={styles.empty}>No more hints.</p>
          ) : (
            <button
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={() => void showNextHint()}
              disabled={hintsLoading}
            >
              {hintsLoading ? <span className={styles.spinner} /> : null}
              {revealedHints.length === 0 ? 'Show a hint' : 'Show next hint'}
            </button>
          )}

          <p className={styles.sectionLabel}>Solution</p>
          {solutionFiles ? (
            <button
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={() => setBottomTab('solution')}
            >
              View solution
            </button>
          ) : passed ? (
            <button
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={() => void viewSolution()}
              disabled={solutionLoading}
            >
              {solutionLoading ? <span className={styles.spinner} /> : null}
              View solution
            </button>
          ) : (
            <button
              className={`${styles.btn} ${styles.btnSmall} ${giveUpArmed ? styles.btnDanger : ''}`}
              onClick={() => void handleGiveUp()}
              disabled={solutionLoading}
            >
              {solutionLoading ? <span className={styles.spinner} /> : null}
              {giveUpArmed ? 'Click again — this question will count as 0' : "I'm stuck — show solution"}
            </button>
          )}
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
            {rightTab === 'preview' ? (
              <>
                <span className={styles.spacer} />
                <button
                  className={styles.tab}
                  onClick={() => previewRef.current?.openInNewTab()}
                  title="Open the preview in its own browser tab, with full DevTools"
                >
                  Open in new tab ↗
                </button>
              </>
            ) : null}
          </div>

          {/*
            Both sides are always mounted; only visibility toggles via CSS,
            rather than one branch of a ternary deciding which side exists in
            the tree. PreviewFrame specifically must survive a tab switch:
            its popup-tab reference (set by "Open in new tab") lives in a ref
            scoped to its own component instance. Unmounting it on every
            switch to the Code tab silently severed that reference -- the
            popped-out tab kept running, but no further Run would ever reach
            it again, with no error anywhere to say why. Staying mounted also
            means returning to Preview after editing code no longer forces a
            full rebuild-and-reload just to look at it; only Run does that.
          */}
          <div className={styles.codeSplit} style={{ display: rightTab === 'code' ? undefined : 'none' }}>
            <FileTree
              files={question.files}
              activePath={activePath}
              dirtyPaths={dirtyPaths}
              onSelect={setActivePath}
            />
            <div className={styles.editorPane}>
              <div className={styles.editorPath}>
                <span className={styles.editorPathActive}>{activePath}</span>
                {activeReadOnly ? <span className={styles.readOnlyNote}>read-only</span> : null}
              </div>
              <div className={styles.paneArea}>
                <CodeEditor
                  path={activePath}
                  value={contents[activePath] ?? ''}
                  readOnly={activeReadOnly}
                  theme={theme}
                  onChange={(value) => setContents((prev) => ({ ...prev, [activePath]: value }))}
                />
              </div>
            </div>
          </div>

          <div
            className={styles.paneArea}
            style={{ display: rightTab === 'preview' ? undefined : 'none' }}
          >
            <PreviewFrame
              ref={previewRef}
              files={files}
              entry={question.entry}
              handlersPath={question.handlersPath}
              runToken={runToken}
              onConsole={onConsole}
              onNetwork={onNetwork}
              onStatus={onStatus}
              onLoaded={onPreviewLoaded}
              onServerLog={onServerLog}
              onTerminalOutput={onTerminalOutput}
              onTestResults={onTestResults}
            />
            {building || !previewLoaded ? (
              <div className={styles.overlay}>
                <span className={styles.spinner} />
                {building
                  ? 'Bundling your app…'
                  : 'Starting the preview — first load can take a little while…'}
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

          <DevToolsPanel
            tab={bottomTab}
            onTabChange={setBottomTab}
            logLines={logLines}
            network={network}
            result={result}
            solutionFiles={solutionFiles}
            terminal={{
              lines: terminalLines,
              onLines: setTerminalLines,
              busy: terminalBusy,
              declaredCommands: question.terminalCommands ?? [],
              hasTests,
              files: question.files,
              originals,
              contents,
              onRun: run,
              onNpmTest: () => void onTerminalNpmTest(),
              onQuestionCommand: onTerminalQuestionCommand,
            }}
          />
        </main>
      </div>
    </div>
  );
}
