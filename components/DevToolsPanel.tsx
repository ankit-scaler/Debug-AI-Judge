'use client';

import { useState } from 'react';
import type { ConsoleLine, NetworkEntry } from './PreviewFrame';
import { ResultCard, type SubmitResult } from './ResultCard';
import styles from './solve.module.css';

export type BottomTab = 'console' | 'network' | 'results';

export interface DevToolsPanelProps {
  tab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  consoleLines: ConsoleLine[];
  network: NetworkEntry[];
  result: SubmitResult | null;
}

export function DevToolsPanel({
  tab,
  onTabChange,
  consoleLines,
  network,
  result,
}: DevToolsPanelProps) {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const tabs: { id: BottomTab; label: string; count?: number }[] = [
    { id: 'console', label: 'Console', count: consoleLines.length },
    { id: 'network', label: 'Network', count: network.length },
    { id: 'results', label: 'Results' },
  ];

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
        {tab === 'console' &&
          (consoleLines.length === 0 ? (
            <p className={styles.empty}>
              Console is empty. For some bugs, that silence is the clue.
            </p>
          ) : (
            consoleLines.map((line, i) => (
              <div
                key={i}
                className={`${styles.logLine} mono ${
                  line.level === 'error' ? styles.logError : line.level === 'warn' ? styles.logWarn : ''
                }`}
              >
                <span>{line.text}</span>
              </div>
            ))
          ))}

        {tab === 'network' &&
          (network.length === 0 ? (
            <p className={styles.empty}>No requests yet. Interact with the app to see traffic.</p>
          ) : (
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
          ))}

        {tab === 'results' && <ResultCard result={result} />}
      </div>
    </section>
  );
}
