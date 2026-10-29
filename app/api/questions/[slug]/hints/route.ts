import { loadQuestion } from '@/src/questions/load-question';

/**
 * Hints are revealed one at a time, never bundled into the initial question
 * payload -- see the no-leak test in load-question.test.ts. The client
 * fetches index 0, 1, 2... in order; it never needs to know the total count
 * upfront, since `hasMore` tells it when to stop offering another one.
 */
export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const index = Number(new URL(request.url).searchParams.get('index') ?? '0');

  try {
    const { meta } = await loadQuestion(slug);
    if (!Number.isInteger(index) || index < 0 || index >= meta.hints.length) {
      return Response.json({ error: 'No hint at this index' }, { status: 404 });
    }
    return Response.json({ hint: meta.hints[index], hasMore: index + 1 < meta.hints.length });
  } catch (err) {
    console.error(`[hints] failed to load "${slug}":`, err);
    return Response.json({ error: 'Question not found' }, { status: 404 });
  }
}
