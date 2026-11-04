# Lab: "Cart quantity is wrong after tapping Add to cart quickly"

**Company:** Flipkart-lite · **Difficulty:** Hard · **Tags:** react, async, race-condition, express, sqlite, concurrency

The full problem statement, with screenshots, is in the [README](../README.md). This page only holds hints.
Try for a while before opening each one.

> **Open this file in a Markdown preview.** In VS Code press `Ctrl+Shift+V` (`Cmd+Shift+V` on a Mac), or use the
> "Open Preview" button at the top right of the editor. The hints are collapsed there and open when you click them.
> In a plain text editor **every hint is visible at once**, so you would see the answers by accident.

## Which hint for which problem

| Problem (see the README) | Start with | Then |
|---|---|---|
| 1. The cart badge shows the wrong number | Hint 1 | Hint 5 |
| 2. After a refresh the cart has duplicate lines | Hint 2 | Hints 3, 4 and 6 |
| 3. The cart holds more than is in stock | Hint 3 | Hint 6 |

Open **one** hint at a time, and go back to the code before opening the next.

## Hints

### Hint 1

<details><summary>Show hint 1 (problem 1)</summary>

Open the app with `?debug=1` and tap **Add to cart** on the Yoga Mat exactly 3 times, as fast as you can. Compare
the **tap #** column with the **arrived** column in the Request log. In the browser's Network tab you can see the same
thing with the `X-Request-Seq` and `X-Debug-Latency-Ms` response headers. Do the responses arrive in the order the
requests were sent?
</details>

### Hint 2

<details><summary>Show hint 2 (problem 2)</summary>

Refresh the page. Does the cart match what the UI showed a second ago? If not, the UI is not the only thing wrong.
Look at the stored rows with `npm run db:inspect`. It works after your own taps and also right after `npm run repro`,
which leaves its rows in the database on purpose.
</details>

### Hint 3

<details><summary>Show hint 3 (problems 2 and 3)</summary>

Open `POST /api/cart/items` in `server/routes/cart.js`. For each line, ask: **what does it read**, **what does it
`await`**, and **what does it write afterwards**? What can happen to the data it read while it was waiting? Now
imagine three requests running that code at the same time.
</details>

### Hint 4

<details><summary>Show hint 4 (problem 2)</summary>

Run `npm run db:inspect -- "SELECT cart_id, product_id, COUNT(*) FROM cart_items GROUP BY 1,2"`. How many rows exist
per (cart, product)? What in `database/schema.sql` is supposed to stop that from happening? (You do not need to run
`npm run reset` after changing the schema: the server rebuilds the database for you the next time it starts.)
</details>

### Hint 5

<details><summary>Show hint 5 (problem 1)</summary>

Each cart response carries a `version` that goes up on every change. What could the client do with that number
when a response arrives?
</details>

### Hint 6

<details><summary>Show hint 6 (problems 2 and 3)</summary>

`better-sqlite3` is synchronous. So once all the slow, asynchronous work (like asking the pricing service) is finished,
a stretch of code with **no `await` in it** cannot be interleaved with another request. Think about what belongs before
the `await` and what belongs after it, and whether a single SQL statement can do the "insert or increase" step by itself.
</details>

## How do I know I am done?

- `npm test` is green
- `npm run repro` prints one line per product with the right quantity, and 409s past the stock limit
- With `?debug=1` open, tapping three times ends with the badge on 3, in any response order
