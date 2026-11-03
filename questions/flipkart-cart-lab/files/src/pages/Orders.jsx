import { useEffect, useState } from 'react';
import { api, rupees } from '../api.js';

export function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    api('GET', '/api/orders').then((r) => setOrders(r.orders)).catch(() => setOrders([]));
  }, []);
  if (!orders) return null;
  if (orders.length === 0) return <p className="card">No orders yet.</p>;
  return (
    <ul className="orders">
      {orders.map((o) => (
        <li key={o.id} className="card">
          <h3>Order #{o.id} · {rupees(o.total)}</h3>
          <p className="muted">{o.address}</p>
          <ul>{o.items.map((i, n) => <li key={n}>{i.quantity} × {i.name}</li>)}</ul>
        </li>
      ))}
    </ul>
  );
}
