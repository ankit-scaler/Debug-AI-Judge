import { loadQuestion } from '@/src/questions/load-question';

/**
 * The "already earned it" path: reveals the reference fix with no side
 * effect, for a learner who has already passed and wants to compare
 * approaches. Deliberately not leak-protected like GET /api/questions/[slug]
 * -- revealing the fix is the whole point here, not a bug.
 *
 * This is a UI-level gate only (the SolveScreen only shows the button once
 * `result.passed` is true in its own state): there is no login or session in
 * this phase (D12), so nothing server-side can verify who is actually
 * asking. The give-up route is the one with a real, permanent server-side
 * consequence -- see app/api/attempts/[slug]/give-up.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  try {
    const { referenceFix } = await loadQuestion(slug);
    return Response.json({ files: referenceFix });
  } catch (err) {
    console.error(`[solution] failed to load "${slug}":`, err);
    return Response.json({ error: 'Question not found' }, { status: 404 });
  }
}
