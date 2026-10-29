import { loadQuestion } from '@/src/questions/load-question';
import { LOCAL_USER_ID, recordGiveUp } from '@/src/server/local-deps';

/**
 * The "I'm stuck" path: permanently marks this user ineligible to score on
 * this question (see grade.ts's `gaveUp` dependency), then hands back the
 * reference fix. A POST, not a GET, because unlike the solution route this
 * one has a real side effect -- it is the one thing standing between
 * "viewed the solution" and "got full marks for it".
 */
export async function POST(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  try {
    const loaded = await loadQuestion(slug);
    recordGiveUp(LOCAL_USER_ID, loaded.meta.id);
    return Response.json({ files: loaded.referenceFix });
  } catch (err) {
    console.error(`[give-up] failed to load "${slug}":`, err);
    return Response.json({ error: 'Question not found' }, { status: 404 });
  }
}
