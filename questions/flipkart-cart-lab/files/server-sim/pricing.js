// Stand-in for the real lab's internal pricing service, which the real cart
// route must `await`. Fixed (not random) delays, same as the real lab's
// LATENCY=lab mode and for the same reason: a burst of concurrent requests
// must reproduce the race *every time*, not just on a lucky (or unlucky) roll.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const BURST_DELAYS_MS = [800, 450, 100];

export function createPricingService(store, { failing = false } = {}) {
  let callIndex = 0;
  return {
    async quote(productId) {
      const delay = BURST_DELAYS_MS[callIndex % BURST_DELAYS_MS.length];
      callIndex += 1;
      await sleep(delay);
      if (failing) throw new Error('pricing service is down');
      const product = store.products.find((p) => p.id === productId);
      if (!product) return null;
      return { id: product.id, name: product.name, stock: product.stock, pricePaise: product.pricePaise };
    },
  };
}
