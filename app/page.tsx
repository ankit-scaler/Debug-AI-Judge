import Link from 'next/link';
import { listQuestions } from '@/src/questions/list-questions';
import styles from './page.module.css';

export default async function Home() {
  const questions = await listQuestions();

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
        {questions.map((q) => (
          <Link key={q.slug} href={`/q/${q.slug}`} className={styles.card}>
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
        ))}
      </div>
    </div>
  );
}
