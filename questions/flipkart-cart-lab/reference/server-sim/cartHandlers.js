// Fixed. Reference for the learner's fix to Problem 2 (part 1) and Problem 3.
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

  const product = await pricing.quote(productId);
  if (!product) return { status: 404, body: { error: 'NOT_FOUND' } };

  // Fix: read "what does this cart already hold" AFTER the only await, not
  // before it. Nothing else can run between this read and the write below --
  // no sibling request's own continuation gets a turn until this one
  // finishes -- so this is effectively the transaction boundary.
  const existing = store.findCartItem(cart.id, productId);
  const nextQty = (existing?.quantity ?? 0) + qty;
  if (nextQty > product.stock) {
    return {
      status: 409,
      body: { error: 'OUT_OF_STOCK', productId, available: Math.max(0, product.stock - (existing?.quantity ?? 0)) },
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
