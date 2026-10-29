'use client';

import styles from './solve.module.css';

export interface CriterionResult {
  id: string;
  description: string;
  passed: boolean;
  evidence: string;
}

export type SubmitResult =
  | { status: 'graded'; passed: boolean; cacheHit: boolean; scored: boolean; criteria: CriterionResult[] }
  | { status: 'invalid_submission'; errors: string[] }
  | { status: 'build_failed'; errors: { file: string; line: number; column: number; text: string }[] }
  | { status: 'grading_unavailable'; message: string }
  | { status: 'system_error'; message: string };

export function ResultCard({ result }: { result: SubmitResult | null }) {
  if (result === null) {
    return <p className={styles.empty}>Submit your fix and the per-criterion result appears here.</p>;
  }

  if (result.status === 'build_failed') {
    return (
      <div>
        <div className={`${styles.banner} ${styles.bannerFail}`}>Your code did not compile</div>
        {result.errors.map((e, i) => (
          <pre key={i} className={`${styles.evidence} mono`}>
            {e.file}:{e.line}:{e.column} — {e.text}
          </pre>
        ))}
        <p className={styles.empty}>Nothing was graded, so this attempt cost nothing.</p>
      </div>
    );
  }

  if (result.status === 'invalid_submission') {
    return (
      <div>
        <div className={`${styles.banner} ${styles.bannerFail}`}>Submission rejected</div>
        {result.errors.map((e, i) => (
          <p key={i} className={styles.criterionText}>
            {e}
          </p>
        ))}
      </div>
    );
  }

  if (result.status === 'grading_unavailable' || result.status === 'system_error') {
    return (
      <div>
        <div className={`${styles.banner} ${styles.bannerNeutral}`}>Not graded</div>
        <p className={styles.criterionText}>{result.message}</p>
      </div>
    );
  }

  const passedCount = result.criteria.filter((c) => c.passed).length;

  return (
    <div>
      <div
        className={`${styles.banner} ${result.passed ? styles.bannerPass : styles.bannerFail}`}
      >
        {result.passed
          ? `Solved — all ${result.criteria.length} criteria passed`
          : `Not solved yet — ${passedCount} of ${result.criteria.length} criteria passed`}
        {result.cacheHit ? <span className={styles.mocked}>cached verdict</span> : null}
      </div>

      {result.criteria.map((c) => (
        <div key={c.id} className={styles.criterion}>
          <span className={c.passed ? styles.ok : styles.bad} aria-hidden="true">
            {c.passed ? '✓' : '✗'}
          </span>
          <div>
            <p className={styles.criterionText}>
              <span className="sr-only">{c.passed ? 'Passed: ' : 'Failed: '}</span>
              {c.description}
            </p>
            {c.evidence ? <pre className={`${styles.evidence} mono`}>{c.evidence}</pre> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
