import { useState } from 'react';
import { api, rupees } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export function Checkout() {
  const { cart, refresh } = useCart();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  async function place(e) {
    e.preventDefault();
    setError('');
    try {
      const r = await api('POST', '/api/orders', { address });
      await refresh();
      setPlacedOrder(r.order);
    } catch (err) {
      setError(err.status === 409 ? 'An item in your cart just went out of stock.' : 'Could not place order.');
    }
  }

  if (placedOrder) {
    return (
      <div className="card" data-testid="order-confirmation">
        <h2>Order placed</h2>
        <p>
          Order #{placedOrder.id} · <strong>{rupees(placedOrder.total)}</strong>
        </p>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={place}>
      <h2>Checkout</h2>
      <p>
        {cart.itemCount} items · <strong>{rupees(cart.subtotal)}</strong>
      </p>
      <label>
        Delivery address
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn primary" disabled={cart.items.length === 0}>
        Place order
      </button>
    </form>
  );
}
