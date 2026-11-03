'use client';

import { useState } from 'react';
import type { ConsoleLine, NetworkEntry } from './PreviewFrame';
import { ResultCard, type SubmitResult } from './ResultCard';
import { TerminalPanel, type TerminalPanelProps } from './TerminalPanel';
import styles from './solve.module.css';

export type BottomTab = 'logs' | 'network' | 'terminal' | 'results' | 'solution';

export interface SolutionFile {
  path: string;
  content: string;
}

/** One line in the Logs tab. `source` says which realm produced it. */
export interface LogLine extends ConsoleLine {
  source: 'client' | 'server';
}

export interface DevToolsPanelProps {
  tab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  logLines: LogLine[];
  network: NetworkEntry[];
  result: SubmitResult | null;
  solutionFiles: SolutionFile[] | null;
  terminal: TerminalPanelProps;
}

type LogFilter = 'all' | 'client' | 'server';

export function DevToolsPanel({
  tab,
  onTabChange,
  logLines,
  network,
  result,
  solutionFiles,
  terminal,
}: DevToolsPanelProps) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [logFilter, setLogFilter] = useState<LogFilter>('all');
  const [netView, setNetView] = useState<'table' | 'timeline'>('table');

  const tabs: { id: BottomTab; label: string; count?: number }[] = [
    { id: 'logs', label: 'Logs', count: logLines.length },
    { id: 'network', label: 'Network', count: network.length },
    { id: 'terminal', label: 'Terminal' },
    { id: 'results', label: 'Results' },
    { id: 'solution', label: 'Solution' },
  ];

  // A render-time predicate over the full accumulated array, never a
  // snapshot taken when the filter changes: lines that arrive while a filter
  // is active, and lines from before it was switched, are filtered by the
  // exact same rule on every render.
  const visibleLogs = logFilter === 'all' ? logLines : logLines.filter((l) => l.source === logFilter);

  return (
    <section className={styles.bottom} aria-label="Developer tools">
      <div className={styles.tabs} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
            {t.count ? <span className={styles.tabCount}>{t.count}</span> : null}
          </button>
        ))}
      </div>

      <div className={styles.bottomBody}>
        {tab === 'logs' && (
          <>
            <div className={styles.toggleRow} role="group" aria-label="Filter logs by source">
              {(['all', 'client', 'server'] as const).map((f) => (
                <button
                  key={f}
                  className={`${styles.toggleChip} ${logFilter === f ? styles.toggleChipActive : ''}`}
                  aria-pressed={logFilter === f}
                  onClick={() => setLogFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'client' ? 'Client' : 'Server'}
                </button>
              ))}
            </div>
            {visibleLogs.length === 0 ? (
              <p className={styles.empty}>
                {logLines.length === 0
                  ? 'Logs are empty. For some bugs, that silence is the clue.'
                  : `No ${logFilter} logs yet.`}
              </p>
            ) : (
              visibleLogs.map((line, i) => (
                <div
                  key={i}
                  className={`${styles.logLine} mono ${
                    line.level === 'error' ? styles.logError : line.level === 'warn' ? styles.logWarn : ''
                  }`}
                >
                  <span className={styles.logSource}>{line.source}</span>
                  <span>{line.text}</span>
                </div>
              ))
            )}
          </>
        )}

        {tab === 'network' && (
          <>
            <div className={styles.toggleRow} role="group" aria-label="Network view">
              {(['table', 'timeline'] as const).map((v) => (
                <button
                  key={v}
                  className={`${styles.toggleChip} ${netView === v ? styles.toggleChipActive : ''}`}
                  aria-pressed={netView === v}
                  onClick={() => setNetView(v)}
                >
                  {v === 'table' ? 'Table' : 'Timeline'}
                </button>
              ))}
            </div>
            {network.length === 0 ? (
              <p className={styles.empty}>No requests yet. Interact with the app to see traffic.</p>
            ) : netView === 'table' ? (
              network.map((entry, i) => (
                <div key={i}>
                  <button
                    className={`${styles.netRow} mono`}
                    onClick={() => setOpenRow(openRow === i ? null : i)}
                    aria-expanded={openRow === i}
                  >
                    <span>{entry.method}</span>
                    <span>{entry.url}</span>
                    <span className={entry.status >= 200 && entry.status < 300 ? styles.ok : styles.bad}>
                      {entry.status || '—'}
                    </span>
                    <span>{entry.durationMs}ms</span>
                  </button>
                  {openRow === i ? (
                    <pre className={`${styles.netBody} mono`}>
                      {entry.mocked ? '# served by the question\'s mock handlers\n' : ''}
                      {entry.requestBody ? `request:  ${entry.requestBody}\n` : ''}
                      {`response: ${entry.responseBody}`}
                    </pre>
                  ) : null}
                </div>
              ))
            ) : (
              <NetworkTimeline network={network} />
            )}
          </>
        )}

        {tab === 'terminal' && <TerminalPanel {...terminal} />}

        {tab === 'results' && <ResultCard result={result} />}

        {tab === 'solution' &&
          (solutionFiles === null ? (
            <p className={styles.empty}>
              Pass the question, or use &ldquo;I&rsquo;m stuck&rdquo; in the left panel, to unlock
              the reference solution.
            </p>
          ) : (
            solutionFiles.map((f) => (
              <div key={f.path}>
                <p className={styles.editorPath}>{f.path}</p>
                <pre className={`${styles.evidence} mono`}>{f.content}</pre>
              </div>
            ))
          ))}
      </div>
    </section>
  );
}

/**
 * Bars positioned by when each request STARTED, sized by how long it took,
 * so where a bar ENDS is when its response arrived. `#n` is arrival rank.
 * Rows are in start (send) order; when the #n labels do not read 1, 2, 3
 * top to bottom, responses arrived out of order. Plain absolutely
 * positioned divs -- no charting dependency.
 */
function NetworkTimeline({ network }: { network: NetworkEntry[] }) {
  const t0 = Math.min(...network.map((e) => e.startedAt));
  const t1 = Math.max(...network.map((e) => e.startedAt + e.durationMs));
  const span = Math.max(1, t1 - t0);
  const bySend = [...network].sort((a, b) => a.startedAt - b.startedAt);
  const byArrival = [...network].sort((a, b) => a.startedAt + a.durationMs - (b.startedAt + b.durationMs));
  return (
    <div>
      {bySend.map((entry, i) => (
        <div key={i} className={`${styles.timelineRow} mono`}>
          <span className={styles.timelineLabel}>
            #{byArrival.indexOf(entry) + 1} {entry.method} {entry.url}{' '}
            <span className={entry.status >= 200 && entry.status < 300 ? styles.ok : styles.bad}>
              {entry.status || '—'}
            </span>
          </span>
          <span className={styles.timelineTrack}>
            <span
              className={styles.timelineBar}
              style={{
                left: `${((entry.startedAt - t0) / span) * 100}%`,
                width: `${Math.max(0.5, (entry.durationMs / span) * 100)}%`,
              }}
              title={`${entry.durationMs}ms`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
