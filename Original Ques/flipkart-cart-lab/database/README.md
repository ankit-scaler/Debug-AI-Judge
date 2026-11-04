# The database

Everything about the database is **static and checked in**, so nothing is random and nothing needs to be
generated before you start.

| File | What it is |
|---|---|
| `database/schema.sql` | The table definitions. **Edit this** if your fix needs a schema change. |
| `database/seed.sql` | The demo users and products, as plain `INSERT` statements (fixed ids and password hashes). |
| `data/shop.db` | A ready-made SQLite file built from the two files above. Used by `npm run dev`. |

`data/shop.db` is only a *copy* of the SQL files. If it ever gets messy (say, after many experiments), run:

```bash
npm run reset      # rebuild data/shop.db from schema.sql + seed.sql; all carts are emptied
```

It also works while `npm run dev` is running. Everyone is logged out afterwards, so refresh the page and log in again.

**Changing the schema:** when you edit `schema.sql` you don't have to remember to reset. On startup the
server compares the SQL files with the database file and, if they differ, rebuilds it and prints a line saying so.

## Tables

```
users ──< sessions            (login tokens)
users ──1 carts ──< cart_items >── products
users ──< orders ──< order_items
```

| Table | Purpose |
|---|---|
| `users` | Two demo accounts: `asha@example.com` and `ravi@example.com`, password `password123` |
| `products` | 10 products. `price_paise` is the price in paise (249900 = ₹2,499). `stock` is units available |
| `carts` | One cart per user. `version` goes up by one on every change to that cart |
| `cart_items` | The lines in a cart: (`cart_id`, `product_id`, `quantity`) |
| `orders`, `order_items` | Placed orders; a snapshot of what was bought and at what price |

Products with interesting stock levels for this lab: **Yoga Mat** (id 43, stock 5) and
**Dumbbell Set** (id 49, stock 3).

## Looking inside

You do not need any SQLite tool. These work out of the box:

```bash
npm run db:inspect                                    # cart lines, duplicates and carts
npm run db:inspect -- "SELECT id, name, stock FROM products"
npm run db:inspect -- "SELECT * FROM cart_items"
```

(They open the database read-only, so it is safe to run them while the server is running.)

If you prefer a GUI, open `data/shop.db` in [DB Browser for SQLite](https://sqlitebrowser.org/) or the
SQLite extension of your editor.
