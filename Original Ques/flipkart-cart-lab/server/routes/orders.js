import { Router } from 'express';
import { requireAuth } from '../middleware.js';
import { getOrCreateCart, loadCart } from '../services/cartView.js';

export function orderRoutes(db) {
  const r = Router();
  r.use(requireAuth(db));

  // POST /api/orders { address } -> checkout the current cart
  r.post('/', (req, res) => {
    const address = String(req.body?.address || '').trim();
    if (address.length < 5) return res.status(400).json({ error: 'ADDRESS_REQUIRED' });

    const cart = getOrCreateCart(db, req.user.id);
    const view = loadCart(db, cart.id);
    if (view.items.length === 0) return res.status(400).json({ error: 'CART_EMPTY' });

    const place = db.transaction(() => {
      const wanted = new Map();
      for (const i of view.items) wanted.set(i.productId, (wanted.get(i.productId) || 0) + i.quantity);
      for (const [productId, qty] of wanted) {
        const info = db
          .prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')
          .run(qty, productId, qty);
        if (info.changes === 0) {
          const err = new Error('OUT_OF_STOCK');
          err.productId = productId;
          throw err;
        }
      }
      const o = db
        .prepare('INSERT INTO orders (user_id, address, total_paise) VALUES (?, ?, ?)')
        .run(req.user.id, address, view.subtotal);
      const orderId = Number(o.lastInsertRowid);
      const ins = db.prepare(
        'INSERT INTO order_items (order_id, product_id, name, unit_paise, quantity) VALUES (?,?,?,?,?)'
      );
      for (const i of view.items) ins.run(orderId, i.productId, i.name, i.unitPrice, i.quantity);
      db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id);
      db.prepare('UPDATE carts SET version = version + 1 WHERE id = ?').run(cart.id);
      return orderId;
    });

    try {
      const orderId = place();
      res.status(201).json({ order: getOrder(db, orderId) });
    } catch (e) {
      if (e.message === 'OUT_OF_STOCK') {
        return res.status(409).json({ error: 'OUT_OF_STOCK', productId: e.productId });
      }
      throw e;
    }
  });

  r.get('/', (req, res) => {
    const ids = db
      .prepare('SELECT id FROM orders WHERE user_id = ? ORDER BY id DESC')
      .all(req.user.id);
    res.json({ orders: ids.map((o) => getOrder(db, o.id)) });
  });

  return r;
}

function getOrder(db, id) {
  const o = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  const items = db
    .prepare(
      'SELECT product_id AS productId, name, unit_paise AS unitPrice, quantity FROM order_items WHERE order_id = ? ORDER BY id'
    )
    .all(id);
  return { id: o.id, address: o.address, total: o.total_paise, createdAt: o.created_at, items };
}
