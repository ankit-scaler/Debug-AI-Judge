/**
 * Stand-in for the internal pricing/promotions service. In production this is
 * a network call (~30-70ms), so callers must `await` it.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createPricingService(db, { minMs = 30, maxMs = 70 } = {}) {
  return {
    async quote(productId) {
      await sleep(minMs + Math.random() * (maxMs - minMs));
      return (
        db
          .prepare('SELECT id, name, price_paise, stock FROM products WHERE id = ?')
          .get(productId) || null
      );
    },
  };
}
