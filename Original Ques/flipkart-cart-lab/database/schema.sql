-- ============================================================================
-- Flipkart-lite schema (SQLite)  ·  database/schema.sql
--
-- This file and database/seed.sql are the single source of truth for the DB.
-- data/shop.db is just a pre-built copy of them, committed so you can open it
-- right away. If you edit this file, the server rebuilds data/shop.db
-- automatically the next time it starts (or run `npm run reset`).
-- ============================================================================

-- Flipkart-lite schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_paise INTEGER NOT NULL CHECK (price_paise >= 0),
  stock       INTEGER NOT NULL CHECK (stock >= 0)
);

-- One open cart per user. `version` is bumped on every cart mutation.
CREATE TABLE IF NOT EXISTS carts (
  id      INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY,
  cart_id    INTEGER NOT NULL REFERENCES carts(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  address     TEXT NOT NULL,
  total_paise INTEGER NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id          INTEGER PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  name        TEXT NOT NULL,
  unit_paise  INTEGER NOT NULL,
  quantity    INTEGER NOT NULL
);
