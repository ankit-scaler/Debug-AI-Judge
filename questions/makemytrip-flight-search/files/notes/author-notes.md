# Author notes (hidden from learners)

Bug: `search()` has no guard against out-of-order responses. Each call
fetches immediately and unconditionally calls `setResults`/`setLoading`
once its own response arrives, regardless of whether a newer search has
since been started.

The mock delays `DEL-BOM` by 1500ms and `BLR-HYD` by 250ms specifically so
that searching DEL→BOM and then quickly BLR→HYD reliably reproduces the
race: `from`/`to` are set synchronously on each call, so they end up correct
(BLR/HYD, since that call happened last and nothing overwrites it afterward).
But BLR-HYD's *results* arrive first and are shown correctly, then DEL-BOM's
slower response arrives afterward and overwrites `results` — ending with
the BLR→HYD heading shown above DEL-BOM's flight cards.

Fix: track a request id (or use `AbortController`) and ignore a response
that is no longer the latest request before applying it to state.
