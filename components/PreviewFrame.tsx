'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { bundlePreview, type PreviewBuildError, type PreviewFile } from '@/src/preview/bundler';
import { ReadyGate } from '@/src/preview/ready-gate';
import type { TestResult } from '@/src/testing/browser-test-harness';

export interface ConsoleLine {
  level: string;
  text: string;
}

export interface NetworkEntry {
  method: string;
  url: string;
  status: number;
  mocked: boolean;
  requestBody: string | null;
  responseBody: string;
  durationMs: number;
  startedAt: number;
}

export interface TerminalOutput {
  id: string;
  runId: number;
  ok: boolean;
  text: string;
}

/** What gets posted into the preview realm on every run. */
interface RunPayload {
  code: string;
  css: string;
}

export interface PreviewFrameProps {
  files: PreviewFile[];
  entry: string;
  handlersPath?: string;
  /** Changing this re-bundles and reloads. The host owns when that happens. */
  runToken: number;
  onConsole: (line: ConsoleLine) => void;
  onNetwork: (entry: NetworkEntry) => void;
  onStatus: (status: { building: boolean; errors: PreviewBuildError[] }) => void;
  /**
   * Called the moment code is actually sent into a loaded, listening iframe --
   * i.e. the preview has something on screen, not just that a bundle compiled.
   * The bundle usually finishes in well under a second; the iframe document
   * itself, on a tab that has never run esbuild-wasm before, can take far
   * longer (confirmed: up to ~20s for a cold WASM compile with no caching
   * yet) with the bundling phase showing as already "done". Without a signal
   * for this second phase, the preview sits blank with no loading indicator
   * at all for however long that takes. The host uses this to keep its
   * loading state up for the whole wait, not just the fast part of it.
   */
  onLoaded: () => void;
  onServerLog: (line: ConsoleLine) => void;
  onTerminalOutput: (output: TerminalOutput) => void;
  onTestResults: (tests: TestResult[]) => void;
}

export interface PreviewFrameHandle {
  /**
   * Opens the same app in a real, top-level browser tab -- not a sandboxed
   * iframe. That tab has a normal origin, so right-click Inspect, F12, the
   * Sources panel and breakpoints all work exactly as they would on any
   * other page, which the embedded preview's sandboxing cannot offer. The
   * tab is kept in sync: every later Run (or edit-triggered rebuild) also
   * posts the new code to it, as long as it is still open.
   */
  openInNewTab: () => void;
  /** Runs a question-defined terminal command inside the LIVE preview iframe. */
  sendTerminalCommand: (id: string, args: string, runId: number) => void;
  /**
   * `npm test`: runs an already-bundled test script in a brand-new HIDDEN
   * iframe -- never the live preview. The test bundle carries its own
   * store, its own fetch interceptor and its own harness; executing it in
   * the live iframe would repoint the learner's running app at the test
   * run's throwaway backend. One fresh iframe per run is the client-side
   * equivalent of execute-tests.ts giving every Submit a fresh jsdom.
   */
  sendRunTests: (code: string) => void;
  /** Tears down an in-flight test iframe (timeout, Run, Reset). Safe to call when none exists. */
  cancelRunTests: () => void;
}

export const PreviewFrame = forwardRef<PreviewFrameHandle, PreviewFrameProps>(function PreviewFrame(
  {
    files,
    entry,
    handlersPath,
    runToken,
    onConsole,
    onNetwork,
    onStatus,
    onLoaded,
    onServerLog,
    onTerminalOutput,
    onTestResults,
  },
  ref,
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const popupRef = useRef<Window | null>(null);
  // The third target, alongside the iframe and the popup: a hidden iframe
  // that exists only while an `npm test` run is in flight. testRunKey is its
  // React key -- a new number mounts a brand-new document; null unmounts it.
  const testFrameRef = useRef<HTMLIFrameElement>(null);
  const [testRunKey, setTestRunKey] = useState<number | null>(null);
  // Held until the hidden iframe announces 'frame-ready' -- posting before
  // its listener exists would be silently dropped, the same race ReadyGate
  // and the popup's frame-ready handshake already exist to prevent.
  const pendingTestCodeRef = useRef<string | null>(null);
  // The last payload actually built, kept outside the gate so a tab opened
  // *after* the current build finished still has something to receive the
  // moment it announces itself ready -- the gate's own copy is cleared by
  // design once it has been sent to the iframe.
  const lastPayloadRef = useRef<RunPayload | null>(null);

  const send = useCallback(
    (payload: RunPayload) => {
      const frame = iframeRef.current?.contentWindow;
      if (!frame) return;
      frame.postMessage({ source: 'debuglab-host', type: 'run', ...payload }, '*');
      onLoaded();
    },
    [onLoaded],
  );

  const sendToPopup = useCallback((payload: RunPayload) => {
    const popup = popupRef.current;
    if (!popup || popup.closed) return;
    popup.postMessage({ source: 'debuglab-host', type: 'run', ...payload }, '*');
  }, []);

  // One gate for the component's whole life. `send` always reads
  // iframeRef.current at call time, so the gate does not need to be recreated
  // per generation -- only reset() needs to run per generation. See
  // src/preview/ready-gate.ts for why this is a plain class and not React
  // state: a prior version of this coordination, built from useState plus two
  // effects, had a real bug where a ref write (queuing the bundle) triggered
  // no re-render, so nothing re-checked readiness once the bundle finished --
  // silently dropping the "frame loaded before the bundle did" ordering,
  // which is the common case, not the edge case.
  const gateRef = useRef<ReadyGate<RunPayload> | null>(null);
  gateRef.current ??= new ReadyGate<RunPayload>(send);

  useImperativeHandle(
    ref,
    () => ({
      openInNewTab() {
        const popup = window.open('/preview/frame.html', 'debuglab-preview');
        popupRef.current = popup;
        // If a build already finished, the popup's own 'frame-ready' message
        // (handled below) is what actually delivers it -- window.open()
        // returns before the new document has attached its listener, so
        // posting here would race and silently drop, the same failure mode
        // ReadyGate exists to prevent for the iframe.
      },
      sendTerminalCommand(id: string, args: string, runId: number) {
        const frame = iframeRef.current?.contentWindow;
        if (!frame) return;
        frame.postMessage(
          { source: 'debuglab-host', type: 'terminal-run', payload: { id, args, runId } },
          '*',
        );
      },
      sendRunTests(code: string) {
        pendingTestCodeRef.current = code;
        setTestRunKey((k) => (k ?? 0) + 1);
      },
      cancelRunTests() {
        pendingTestCodeRef.current = null;
        setTestRunKey(null);
      },
    }),
    [],
  );

  // Messages from the preview realm: console output, network activity,
  // crashes -- from the embedded iframe, a popped-out tab, or the hidden
  // npm-test iframe. event.source tells them apart, since all three post the
  // same message shape. The live iframe and the popup are treated
  // identically (Console/Network stay a single source of truth); the test
  // iframe is handled entirely separately and FIRST, so its traffic never
  // reaches the live Logs/Network panels and its 'frame-ready' never marks
  // the live preview's gate ready.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: string; type?: string; payload?: unknown }
        | undefined;
      if (!data || data.source !== 'debuglab-preview') return;

      const testFrame = testFrameRef.current?.contentWindow;
      if (testFrame && event.source === testFrame) {
        if (data.type === 'frame-ready') {
          const code = pendingTestCodeRef.current;
          pendingTestCodeRef.current = null;
          if (code !== null) testFrame.postMessage({ source: 'debuglab-host', type: 'run-tests', code }, '*');
          return;
        }
        if (data.type === 'test-results') {
          onTestResults((data.payload as { tests: TestResult[] }).tests);
          setTestRunKey(null); // done -- discard this iframe; the next run gets a fresh one
          return;
        }
        if (data.type === 'error') {
          // An uncaught error in the test realm: in practice a test file
          // throwing while its module evaluates, before the harness's own
          // try/catch exists to report it. The harness will never report, so
          // end the run here rather than waiting for the host's timeout.
          const { text } = data.payload as { text: string };
          onTestResults([{ name: 'test file failed to load', passed: false, error: text }]);
          setTestRunKey(null);
          return;
        }
        // console / network / server-log from a test run: intentionally
        // dropped. They describe the test's throwaway backend, not the live
        // app, and would be indistinguishable from the app's own traffic.
        return;
      }

      // A message whose source is neither the (possibly already-torn-down)
      // test frame nor a live target (the mounted iframe or an open popup)
      // is a straggler from a generation we've already discarded -- e.g. the
      // test iframe's own 'network'/'console'/'frame-ready' arriving after
      // setTestRunKey(null) already nulled testFrameRef. Without this guard
      // those messages fall through to the branches below: test traffic
      // leaks into the live Network/Logs tabs, and a stray 'frame-ready'
      // can mark a freshly-reset live gate ready before the live iframe has
      // actually mounted its listener, which is the exact race ReadyGate
      // exists to prevent.
      const fromLive =
        event.source === iframeRef.current?.contentWindow ||
        (popupRef.current !== null && event.source === popupRef.current);
      if (!fromLive) return;

      if (data.type === 'frame-ready') {
        if (event.source === popupRef.current) {
          if (lastPayloadRef.current !== null) sendToPopup(lastPayloadRef.current);
        } else {
          gateRef.current!.markReady();
        }
        return;
      }
      if (data.type === 'console') {
        onConsole(data.payload as ConsoleLine);
        return;
      }
      if (data.type === 'network') {
        onNetwork(data.payload as NetworkEntry);
        return;
      }
      if (data.type === 'server-log') {
        onServerLog(data.payload as ConsoleLine);
        return;
      }
      if (data.type === 'terminal-output') {
        onTerminalOutput(data.payload as TerminalOutput);
        return;
      }
      if (data.type === 'error') {
        const { text } = data.payload as { text: string };
        onConsole({ level: 'error', text });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onConsole, onNetwork, onServerLog, onTerminalOutput, onTestResults, sendToPopup]);

  // Bundle on demand and hand the result to the gate, which sends it the
  // moment both the bundle and the (possibly not-yet-loaded) iframe are ready,
  // regardless of which one finishes first. Also mirrored to an open popup.
  useEffect(() => {
    let cancelled = false;

    // A new runToken remounts the iframe below (key={runToken}): a brand new
    // document that has not announced itself yet. Reset the gate so a ready
    // signal left over from the PREVIOUS iframe generation can never cause
    // code to be posted into a frame that has not loaded its listener yet.
    gateRef.current!.reset();

    async function build() {
      onStatus({ building: true, errors: [] });
      const result = await bundlePreview({ files, entry, handlersPath });
      if (cancelled) return;

      if (!result.ok) {
        onStatus({ building: false, errors: result.errors });
        return;
      }
      onStatus({ building: false, errors: [] });
      const payload: RunPayload = { code: result.code, css: result.css };
      lastPayloadRef.current = payload;
      gateRef.current!.setPayload(payload);
      sendToPopup(payload);
    }

    void build();
    return () => {
      cancelled = true;
    };
    // files/entry are intentionally not dependencies: the host controls when a
    // rebuild happens via runToken, so typing does not trigger a bundle per keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runToken]);

  return (
    <>
      <iframe
        // Keyed by runToken so React discards the old DOM node and mounts a
        // genuinely new one on every run, rather than reusing a document that
        // has already executed whatever JS it loaded. Without this, editing
        // frame.html (or anything it loads) has no effect on a tab that has
        // been sitting on the Preview tab since before the edit -- the running
        // document is immune to changes on disk until something forces a real
        // reload. This makes every run that reload, unconditionally.
        key={runToken}
        ref={iframeRef}
        src="/preview/frame.html"
        title="App preview"
        // allow-forms: without it, real Chrome never dispatches a sandboxed
        // iframe's form 'submit' event at all (confirmed live -- clicking
        // Login produced no network request and no error, in either the
        // click or Enter-key path; the same code logs in fine in the
        // unsandboxed "Open in new tab" popup). allow-same-origin is
        // deliberately still absent: that one DOES matter for isolation
        // (it would give the iframe's localStorage/cookies the same origin
        // as this app), and nothing here needs it -- login already works
        // via an in-memory token (api.js's getToken/setToken), not cookies.
        sandbox="allow-scripts allow-modals allow-forms"
        style={{ width: '100%', height: '100%', border: 0, background: '#fff' }}
      />
      {testRunKey !== null ? (
        <iframe
          key={`test-${testRunKey}`}
          ref={testFrameRef}
          src="/preview/frame.html"
          title="npm test runner"
          aria-hidden="true"
          tabIndex={-1}
          sandbox="allow-scripts"
          style={{ display: 'none' }}
        />
      ) : null}
    </>
  );
});
