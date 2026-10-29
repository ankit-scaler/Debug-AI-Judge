# Author notes — hidden from learners

The bug is in `src/CartContext.jsx`: the handler reads `data.items`, but the cart
service responds with `{ cart: { items: [...] } }`. The `|| []` fallback is what
makes it silent — without it the learner would get a TypeError and find it in
seconds.

Expected discovery path: the Network panel, not the console.
