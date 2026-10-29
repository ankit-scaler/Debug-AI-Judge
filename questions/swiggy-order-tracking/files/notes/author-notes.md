# Author notes (hidden from learners)

Bug: `useOrderTimer`'s effect has an empty dependency array and never clears
its interval. Switching the selected order does not remount `OrderDetail`
(no `key` on it in `OrderList`), so the original interval keeps polling the
FIRST selected order's status endpoint forever, via a stale `orderId`
closure captured when the effect first ran.

Fix: depend on `orderId` and clear the interval in the effect's cleanup:

```js
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/orders/${orderId}/status`);
    const data = await res.json();
    setStatus(data.status);
  }, 2000);
  return () => clearInterval(interval);
}, [orderId]);
```
