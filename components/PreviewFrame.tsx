'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { bundlePreview, type PreviewBuildError, type PreviewFile } from '@/src/preview/bundler';

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
  const [frameReady, setFrameReady] = useState(false);
  const pendingCode = useRef<string | null>(null);

  // Messages from the preview realm: console output, network activity, crashes.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: string; type?: string; payload?: unknown }
        | undefined;
      if (!data || data.source !== 'debuglab-preview') return;

      if (data.type === 'frame-ready') {
        setFrameReady(true);
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

  const send = useCallback((code: string) => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ source: 'debuglab-host', type: 'run', code }, '*');
  }, []);

  // Bundle on demand, then hand the result to the frame. If the frame has not
  // announced itself yet, hold the code until it does.
  useEffect(() => {
    let cancelled = false;

    // A new runToken remounts the iframe below (key={runToken}), so this is
    // always a brand new document that has not announced itself yet. Reset
    // synchronously, in the same render pass as the runToken change, so a
    // stale "ready" from the PREVIOUS iframe generation can never cause code
    // to be posted into a frame that has not loaded its listener yet --
    // postMessage into a frame before it's listening drops the message
    // silently, leaving the preview blank with no error.
    setFrameReady(false);
    pendingCode.current = null;

    async function build() {
      onStatus({ building: true, errors: [] });
      const result = await bundlePreview({ files, entry, handlersPath });
      if (cancelled) return;

      if (!result.ok) {
        onStatus({ building: false, errors: result.errors });
        return;
      }
      onStatus({ building: false, errors: [] });
      // frameReady is read fresh via a ref-free closure concern: this reads
      // the state captured at effect-run time, which is always false right
      // after the reset above, so the result always queues and is sent by
      // the frameReady effect once the new iframe actually announces itself.
      pendingCode.current = result.code;
    }

    void build();
    return () => {
      cancelled = true;
    };
    // files/entry are intentionally not dependencies: the host controls when a
    // rebuild happens via runToken, so typing does not trigger a bundle per keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runToken]);

  useEffect(() => {
    if (frameReady && pendingCode.current) {
      send(pendingCode.current);
      pendingCode.current = null;
    }
  }, [frameReady, send]);

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
