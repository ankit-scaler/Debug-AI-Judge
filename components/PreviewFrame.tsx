'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { bundlePreview, type PreviewBuildError, type PreviewFile } from '@/src/preview/bundler';
import { ReadyGate } from '@/src/preview/ready-gate';

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
}

export const PreviewFrame = forwardRef<PreviewFrameHandle, PreviewFrameProps>(function PreviewFrame(
  { files, entry, handlersPath, runToken, onConsole, onNetwork, onStatus, onLoaded },
  ref,
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const popupRef = useRef<Window | null>(null);
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
    }),
    [],
  );

  // Messages from the preview realm: console output, network activity,
  // crashes -- from either the embedded iframe or a popped-out tab.
  // event.source tells the two apart, since both post the same message
  // shape; everything except frame-ready is treated identically regardless
  // of which one sent it, so the Console/Network panels stay a single
  // source of truth even when a learner is also driving the popped-out tab.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: string; type?: string; payload?: unknown }
        | undefined;
      if (!data || data.source !== 'debuglab-preview') return;

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
      if (data.type === 'error') {
        const { text } = data.payload as { text: string };
        onConsole({ level: 'error', text });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onConsole, onNetwork, sendToPopup]);

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
      sandbox="allow-scripts allow-modals"
      style={{ width: '100%', height: '100%', border: 0, background: '#fff' }}
    />
  );
});
