// Ported from the real lab's server/routes/cart.js. This is the learner's
// code to fix -- Problems 2 and 3 both live in postItems below.
const MAX_PER_ADD = 10;

export function getCart(store, userId) {
  const cart = store.getOrCreateCart(userId);
  return { status: 200, body: store.loadCart(cart.id) };
}

export async function postItems(store, pricing, userId, body) {
  const productId = Number(body?.productId);
  const qty = body?.quantity === undefined ? 1 : Number(body.quantity);
  if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 1 || qty > MAX_PER_ADD) {
    return { status: 400, body: { error: 'INVALID_INPUT' } };
  }

  const cart = store.getOrCreateCart(userId);

  // What does this cart already hold for the product? Captured now, like a
  // real SQL `SELECT ... .get()` -- a snapshot of this instant, not a value
  // that keeps reflecting whatever a sibling request does to the row later.
  const existing = store.findCartItem(cart.id, productId);
  const existingQtyAtReadTime = existing?.quantity ?? 0;

  // Ask the pricing service for the live price and stock. This is the only
  // await between the read above and the write below -- the whole reason
  // a race is possible at all.
  const product = await pricing.quote(productId);
  if (!product) return { status: 404, body: { error: 'NOT_FOUND' } };

  const nextQty = existingQtyAtReadTime + qty;
  if (nextQty > product.stock) {
    return {
      status: 409,
      body: {
        error: 'OUT_OF_STOCK',
        productId,
        available: Math.max(0, product.stock - existingQtyAtReadTime),
      },
    };
  }

  if (existing) {
    existing.quantity = nextQty;
  } else {
    store.insertCartItemDirect(cart.id, productId, qty);
  }
  store.bumpVersion(cart.id);

  return { status: 200, body: store.loadCart(cart.id) };
}

export function patchItem(store, userId, productId, body) {
  const qty = Number(body?.quantity);
  if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 0) {
    return { status: 400, body: { error: 'INVALID_INPUT' } };
  }
  const product = store.products.find((p) => p.id === productId);
  if (!product) return { status: 404, body: { error: 'NOT_FOUND' } };
  if (qty > product.stock) {
    return { status: 409, body: { error: 'OUT_OF_STOCK', productId, available: product.stock } };
  }
  const cart = store.getOrCreateCart(userId);
  store.cartItems = store.cartItems.filter((ci) => !(ci.cartId === cart.id && ci.productId === productId));
  if (qty > 0) store.insertCartItemDirect(cart.id, productId, qty);
  store.bumpVersion(cart.id);
  return { status: 200, body: store.loadCart(cart.id) };
}

export function deleteItem(store, userId, productId) {
  const cart = store.getOrCreateCart(userId);
  store.cartItems = store.cartItems.filter((ci) => !(ci.cartId === cart.id && ci.productId === productId));
  store.bumpVersion(cart.id);
  return { status: 200, body: store.loadCart(cart.id) };
}
