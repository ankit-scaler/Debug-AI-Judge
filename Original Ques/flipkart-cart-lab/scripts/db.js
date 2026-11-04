// Look inside the database without installing any SQLite tool.
//   npm run db:inspect                       -> carts, cart lines and stock at a glance
//   npm run db:inspect -- "SELECT * FROM cart_items"   -> run any query
import Database from 'better-sqlite3';
import { DEFAULT_DB_FILE } from '../server/db.js';

const db = new Database(process.env.DB_FILE || DEFAULT_DB_FILE, { readonly: true });
const sql = process.argv.slice(2).join(' ').trim();

const show = (title, rows) => {
  console.log(`\n${title}`);
  rows.length ? console.table(rows) : console.log('  (no rows)');
};

if (sql) {
  show(sql, db.prepare(sql).all());
} else {
  show(
    'cart_items  (one row per product per cart is what we expect)',
    db
      .prepare(
        `SELECT ci.id, u.email AS user, ci.product_id, p.name, ci.quantity, p.stock
           FROM cart_items ci
           JOIN carts c ON c.id = ci.cart_id JOIN users u ON u.id = c.user_id
           JOIN products p ON p.id = ci.product_id ORDER BY ci.id`
      )
      .all()
  );
  show(
    'rows per (cart, product)  -> anything above 1 is a duplicate line',
    db
      .prepare(
        `SELECT cart_id, product_id, COUNT(*) AS rows, SUM(quantity) AS total_qty
           FROM cart_items GROUP BY cart_id, product_id HAVING COUNT(*) > 1`
      )
      .all()
  );
  show('carts', db.prepare('SELECT * FROM carts').all());
}
