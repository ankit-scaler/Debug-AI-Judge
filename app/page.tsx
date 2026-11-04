import Link from 'next/link';
import { listQuestions } from '@/src/questions/list-questions';
import styles from './page.module.css';

// The one question actively being authored/maintained; every other question
// is older and collapsed under "Old questions" below it (see QuestionCard).
// A plain slug check, not a field on QuestionMeta -- there's exactly one
// featured question today, and adding a real "featured" flag for a set of
// one would be solving a problem that doesn't exist yet.
const FEATURED_SLUG = 'flipkart-cart-lab';

function QuestionCard({ q }: { q: Awaited<ReturnType<typeof listQuestions>>[number] }) {
  return (
    <Link href={`/q/${q.slug}`} className={styles.card}>
      <span className={styles.company}>{q.company}</span>
      <h2 className={styles.title}>{q.title}</h2>
      <p className={styles.scenario}>{q.scenario}</p>
      <div className={styles.tagRow}>
        <span className={styles.tag}>{q.difficulty}</span>
        {q.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default async function Home() {
  const questions = await listQuestions();
  const featured = questions.filter((q) => q.slug === FEATURED_SLUG);
  const older = questions.filter((q) => q.slug !== FEATURED_SLUG);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>
          Debugging<span className={styles.brandAccent}>Lab</span>
        </span>
        <p className={styles.subtitle}>
          Pick a question. Each one is a small real app with one bug {'—'} find it, fix it,
          submit.
        </p>
      </header>

      <div className={styles.grid}>
        {featured.map((q) => (
          <QuestionCard key={q.slug} q={q} />
        ))}
      </div>

      {older.length > 0 ? (
        <details className={styles.oldSection}>
          <summary className={styles.oldSummary}>Old questions ({older.length})</summary>
          <div className={styles.grid}>
            {older.map((q) => (
              <QuestionCard key={q.slug} q={q} />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
