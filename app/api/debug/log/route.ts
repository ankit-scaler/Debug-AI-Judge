/**
 * Local-only debug sink. The browser-side bundler posts here when something
 * surprising happens, so evidence lands in the dev server's own log instead of
 * requiring someone to open DevTools and paste it back. Never used outside
 * local development -- there is no database, no auth, and it is not linked from
 * anywhere a learner would reach.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log('[browser]', JSON.stringify(body, null, 2));
  return new Response(null, { status: 204 });
}
