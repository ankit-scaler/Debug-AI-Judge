/** Shared helpers for reading a cart and shaping it for the API. */

export function getOrCreateCart(db, userId) {
  let cart = db.prepare('SELECT id, version FROM carts WHERE user_id = ?').get(userId);
  if (!cart) {
    const info = db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(userId);
    cart = { id: Number(info.lastInsertRowid), version: 0 };
  }
  return cart;
}

export function loadCart(db, cartId) {
  const cart = db.prepare('SELECT id, version FROM carts WHERE id = ?').get(cartId);
  const rows = db
    .prepare(
      `SELECT ci.id AS lineId, ci.product_id AS productId, p.name,
              p.price_paise AS unitPrice, p.stock, ci.quantity
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = ?
        ORDER BY ci.id`
    )
    .all(cartId);
  const items = rows.map((r) => ({ ...r, lineTotal: r.unitPrice * r.quantity }));
  return {
    cartId: cart.id,
    version: cart.version,
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
  };
}
