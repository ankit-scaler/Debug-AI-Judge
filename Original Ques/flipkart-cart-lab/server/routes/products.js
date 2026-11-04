import { Router } from 'express';

const toDto = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  price: p.price_paise,
  stock: p.stock,
});

export function productRoutes(db) {
  const r = Router();

  r.get('/', (req, res) => {
    const q = String(req.query.q || '').trim();
    const category = String(req.query.category || '').trim();
    const rows = db
      .prepare(
        `SELECT * FROM products
         WHERE (? = '' OR name LIKE '%' || ? || '%' OR description LIKE '%' || ? || '%')
           AND (? = '' OR category = ?)
         ORDER BY id`
      )
      .all(q, q, q, category, category);
    const categories = db
      .prepare('SELECT DISTINCT category FROM products ORDER BY category')
      .all()
      .map((c) => c.category);
    res.json({ products: rows.map(toDto), categories });
  });

  r.get('/:id', (req, res) => {
    const p = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
    if (!p) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ product: toDto(p) });
  });

  return r;
}
