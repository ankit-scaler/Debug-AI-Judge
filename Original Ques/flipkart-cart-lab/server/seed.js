import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildDb, SEED_FILE, DEFAULT_DB_FILE } from './db.js';

/** Insert the static rows from database/seed.sql into an empty database. */
export function seed(db) {
  db.exec(readFileSync(SEED_FILE, 'utf8'));
}

// `npm run reset` -> rebuild data/shop.db from database/schema.sql + database/seed.sql
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.env.DB_FILE || DEFAULT_DB_FILE;
  const db = buildDb(file);
  const n = (t) => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
  console.log(`Rebuilt ${file}: ${n('products')} products, ${n('users')} users, empty carts.`);
}
