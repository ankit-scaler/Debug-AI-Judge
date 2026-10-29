import { loadQuestion, toLearnerQuestion } from '@/src/questions/load-question';

export async function GET(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  try {
    const loaded = await loadQuestion(slug);
    // toLearnerQuestion is an allow-list: no rubric, no reference fix, no hidden
    // files. Covered by src/questions/load-question.test.ts.
    return Response.json(toLearnerQuestion(loaded));
  } catch (err) {
    console.error(`[questions] failed to load "${slug}":`, err);
    return Response.json({ error: 'Question not found' }, { status: 404 });
  }
}
