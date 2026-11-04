import Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SCHEMA_FILE = path.join(root, 'database', 'schema.sql');
export const SEED_FILE = path.join(root, 'database', 'seed.sql');
export const DEFAULT_DB_FILE = path.join(root, 'data', 'shop.db');

/** Open a database and make sure the tables exist (no data). */
export function openDb(file = ':memory:') {
  const db = new Database(file);
  db.pragma('foreign_keys = ON');
  db.exec(readFileSync(SCHEMA_FILE, 'utf8'));
  return db;
}

/** Fingerprint of schema.sql + seed.sql, stored in the DB file as PRAGMA user_version. */
export function sqlFingerprint() {
  const h = createHash('sha1')
    .update(readFileSync(SCHEMA_FILE))
    .update(readFileSync(SEED_FILE))
    .digest();
  return h.readUInt32BE(0) & 0x7fffffff;
}

/** Drop every table. Done in place (not by deleting the file) so that `npm run reset` also works while the server is running. */
function dropEverything(db) {
  db.pragma('foreign_keys = OFF');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all();
  db.transaction(() => tables.forEach(({ name }) => db.exec(`DROP TABLE IF EXISTS "${name}"`)))();
}

/** Create (or overwrite) a database file from database/schema.sql + database/seed.sql. */
export function buildDb(file = DEFAULT_DB_FILE) {
  if (file !== ':memory:') mkdirSync(path.dirname(file), { recursive: true });
  const probe = new Database(file);
  dropEverything(probe);
  probe.close();
  const db = openDb(file);
  db.exec(readFileSync(SEED_FILE, 'utf8'));
  db.pragma(`user_version = ${sqlFingerprint()}`);
  return db;
}

/**
 * Open the committed data/shop.db. If database/*.sql changed since it was built
 * (for example you added a UNIQUE constraint), rebuild it so the file never
 * silently disagrees with schema.sql.
 */
export function openOrBuildDb(file = DEFAULT_DB_FILE) {
  if (!existsSync(file)) return buildDb(file);
  const db = new Database(file);
  if (db.pragma('user_version', { simple: true }) === sqlFingerprint()) {
    db.pragma('foreign_keys = ON');
    return db;
  }
  db.close();
  console.log('database/*.sql changed since data/shop.db was built -> rebuilding it (cart data reset).');
  return buildDb(file);
}
