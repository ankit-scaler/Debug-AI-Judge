import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, rupees } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export function Checkout() {
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  async function place(e) {
    e.preventDefault();
    try {
      await api('POST', '/api/orders', { address });
      await refresh();
      navigate('/orders');
    } catch (err) {
      setError(err.status === 409 ? 'An item in your cart just went out of stock.' : 'Could not place order.');
    }
  }

  return (
    <form className="card form" onSubmit={place}>
      <h2>Checkout</h2>
      <p>{cart.itemCount} items · <strong>{rupees(cart.subtotal)}</strong></p>
      <label>Delivery address<textarea value={address} onChange={(e) => setAddress(e.target.value)} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn primary" disabled={cart.items.length === 0}>Place order</button>
    </form>
  );
}
