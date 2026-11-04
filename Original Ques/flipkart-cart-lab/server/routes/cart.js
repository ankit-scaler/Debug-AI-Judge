import { Router } from 'express';
import { asyncHandler, requireAuth } from '../middleware.js';
import { getOrCreateCart, loadCart } from '../services/cartView.js';

const MAX_PER_ADD = 10;

export function cartRoutes(db, pricing) {
  const r = Router();
  r.use(requireAuth(db));

  // GET /api/cart -> current cart
  r.get('/', (req, res) => {
    const cart = getOrCreateCart(db, req.user.id);
    res.json(loadCart(db, cart.id));
  });

  // POST /api/cart/items { productId, quantity? } -> add to cart
  // asyncHandler: an error thrown after an `await` becomes a 500 response, not a server crash.
  r.post('/items', asyncHandler(async (req, res) => {
    const productId = Number(req.body?.productId);
    const qty = req.body?.quantity === undefined ? 1 : Number(req.body.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 1 || qty > MAX_PER_ADD) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }

    const cart = getOrCreateCart(db, req.user.id);

    // What does this cart already hold for the product?
    const existing = db
      .prepare('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?')
      .get(cart.id, productId);

    // Ask the pricing service for the live price and stock.
    const product = await pricing.quote(productId);
    if (!product) return res.status(404).json({ error: 'NOT_FOUND' });

    const nextQty = (existing?.quantity ?? 0) + qty;
    if (nextQty > product.stock) {
      return res.status(409).json({
        error: 'OUT_OF_STOCK',
        productId,
        available: Math.max(0, product.stock - (existing?.quantity ?? 0)),
      });
    }

    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(nextQty, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)').run(
        cart.id,
        productId,
        qty
      );
    }
    db.prepare('UPDATE carts SET version = version + 1 WHERE id = ?').run(cart.id);

    res.json(loadCart(db, cart.id));
  }));

  // PATCH /api/cart/items/:productId { quantity } -> set an exact quantity (0 removes)
  r.patch('/items/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const qty = Number(req.body?.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }
    const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(productId);
    if (!product) return res.status(404).json({ error: 'NOT_FOUND' });
    if (qty > product.stock) {
      return res.status(409).json({ error: 'OUT_OF_STOCK', productId, available: product.stock });
    }
    const cart = getOrCreateCart(db, req.user.id);
    db.transaction(() => {
      db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(cart.id, productId);
      if (qty > 0) {
        db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)').run(
          cart.id,
          productId,
          qty
        );
      }
      db.prepare('UPDATE carts SET version = version + 1 WHERE id = ?').run(cart.id);
    })();
    res.json(loadCart(db, cart.id));
  });

  // DELETE /api/cart/items/:productId -> remove a product
  r.delete('/items/:productId', (req, res) => {
    const cart = getOrCreateCart(db, req.user.id);
    db.transaction(() => {
      db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(
        cart.id,
        Number(req.params.productId)
      );
      db.prepare('UPDATE carts SET version = version + 1 WHERE id = ?').run(cart.id);
    })();
    res.json(loadCart(db, cart.id));
  });

  return r;
}
