import { useEffect, useState } from 'react';
import { getJson } from '../../lib/apiClient.js';
import { OrderDetail } from './OrderDetail.jsx';

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    getJson('/api/orders').then((data) => {
      setOrders(data.orders);
      if (data.orders.length > 0) setSelectedId(data.orders[0].id);
    });
  }, []);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="order-list">
      <ul className="order-list__tabs">
        {orders.map((order) => (
          <li key={order.id}>
            <button
              className={
                order.id === selectedId ? 'order-list__tab order-list__tab--active' : 'order-list__tab'
              }
              onClick={() => setSelectedId(order.id)}
              data-testid={`select-order-${order.id}`}
            >
              {order.restaurant}
            </button>
          </li>
        ))}
      </ul>
      {selected ? <OrderDetail order={selected} /> : <p>Loading your orders…</p>}
    </div>
  );
}
