# Author notes (hidden from learners)

Bug: `useRestaurants` never checks the response status. When the mock
returns a 503 with `{ error: ... }` for the Italian filter, `data.restaurants`
is `undefined`, and `setRestaurants(undefined)` is called anyway.
`RestaurantGrid` then calls `restaurants.map(...)` on `undefined`, which
throws and crashes the render tree — visible as a blank grid plus an
uncaught error in the console/crash panel.

Fix: check `res.ok` (or the status) in `useRestaurants`, expose an `error`
state, and have `RestaurantGrid` render the (already-present, currently
unused) `ErrorBanner` component when `error` is set instead of mapping over
`restaurants` unconditionally.
