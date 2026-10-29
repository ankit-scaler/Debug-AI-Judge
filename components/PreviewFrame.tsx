'use client';

import { useCallback, useEffect, useRef } from 'react';
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

export interface PreviewFrameProps {
  files: PreviewFile[];
  entry: string;
  handlersPath?: string;
  /** Changing this re-bundles and reloads. The host owns when that happens. */
  runToken: number;
  onConsole: (line: ConsoleLine) => void;
  onNetwork: (entry: NetworkEntry) => void;
  onStatus: (status: { building: boolean; errors: PreviewBuildError[] }) => void;
}

export function PreviewFrame({
  files,
  entry,
  handlersPath,
  runToken,
  onConsole,
  onNetwork,
  onStatus,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const send = useCallback((code: string) => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ source: 'debuglab-host', type: 'run', code }, '*');
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
  const gateRef = useRef<ReadyGate | null>(null);
  gateRef.current ??= new ReadyGate(send);

  // Messages from the preview realm: console output, network activity, crashes.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: string; type?: string; payload?: unknown }
        | undefined;
      if (!data || data.source !== 'debuglab-preview') return;

      if (data.type === 'frame-ready') {
        gateRef.current!.markReady();
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
  }, [onConsole, onNetwork]);

  // Bundle on demand and hand the result to the gate, which sends it the
  // moment both the bundle and the (possibly not-yet-loaded) iframe are ready,
  // regardless of which one finishes first.
  useEffect(() => {
    let cancelled = false;

    // A new runToken remounts the iframe below (key={runToken}): a brand new
    // document that has not announced itself yet. Reset the gate so a ready
    // signal left over from the PREVIOUS iframe generation can never cause
    // code to be sent into a frame that has not loaded its listener yet.
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
      gateRef.current!.setCode(result.code);
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
}
