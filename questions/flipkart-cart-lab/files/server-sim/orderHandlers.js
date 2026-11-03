// Ported from the real lab's server/routes/orders.js. Not one of this
// question's three bugs, but checkout is how Problem 2/3's knock-on effect
// (overcharging, or checking out more than is in stock) actually surfaces.
export function postOrder(store, userId, body) {
  const address = String(body?.address || '').trim();
  if (address.length < 5) return { status: 400, body: { error: 'ADDRESS_REQUIRED' } };

  const cart = store.getOrCreateCart(userId);
  const view = store.loadCart(cart.id);
  if (view.items.length === 0) return { status: 400, body: { error: 'CART_EMPTY' } };

  const wanted = new Map();
  for (const item of view.items) wanted.set(item.productId, (wanted.get(item.productId) || 0) + item.quantity);

  for (const [productId, qty] of wanted) {
    const product = store.products.find((p) => p.id === productId);
    if (!product || product.stock < qty) {
      return { status: 409, body: { error: 'OUT_OF_STOCK', productId } };
    }
  }
  for (const [productId, qty] of wanted) {
    store.products.find((p) => p.id === productId).stock -= qty;
  }

  const orderId = store.nextOrderId();
  const order = {
    id: orderId,
    userId,
    address,
    totalPaise: view.subtotal,
    items: view.items.map((i) => ({ productId: i.productId, name: i.name, unitPrice: i.unitPrice, quantity: i.quantity })),
  };
  store.orders.push(order);
  store.cartItems = store.cartItems.filter((ci) => ci.cartId !== cart.id);
  store.bumpVersion(cart.id);

  return { status: 201, body: { order: { id: order.id, address: order.address, total: order.totalPaise, items: order.items } } };
}
