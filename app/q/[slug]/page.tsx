import { notFound } from 'next/navigation';
import { SolveScreen, type LearnerQuestionProps } from '@/components/SolveScreen';
import { loadQuestion, toLearnerQuestion } from '@/src/questions/load-question';

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const learner = toLearnerQuestion(await loadQuestion(slug));
    // Only the learner-safe projection crosses into the client component. The
    // rubric, the reference fix and hidden files never leave the server.
    return <SolveScreen question={learner as LearnerQuestionProps} />;
  } catch (err) {
    console.error(`[page] question "${slug}" could not be loaded:`, err);
    notFound();
  }
}
