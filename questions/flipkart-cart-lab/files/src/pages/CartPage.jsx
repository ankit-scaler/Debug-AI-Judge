import { rupees } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useNav } from '../context/NavContext.jsx';
import { Notice } from '../components/Notice.jsx';

export function CartPage() {
  const { cart, setQuantity, removeItem } = useCart();
  const { navigate } = useNav();
  if (cart.items.length === 0) {
    return (
      <p className="card">
        Your cart is empty.{' '}
        <button className="link" onClick={() => navigate('catalog')}>
          Keep shopping
        </button>
      </p>
    );
  }
  return (
    <div className="card">
      <Notice />
      <h2>Your cart</h2>
      <ul data-testid="cart" className="cart-lines">
        {cart.items.map((i) => (
          <li key={i.lineId}>
            <span className="grow">{i.name}</span>
            <span className="qty">
              <button aria-label="decrease" onClick={() => setQuantity(i.productId, i.quantity - 1)}>
                −
              </button>
              <span data-testid={`qty-${i.productId}`}>{i.quantity}</span>
              <button aria-label="increase" onClick={() => setQuantity(i.productId, i.quantity + 1)}>
                +
              </button>
            </span>
            <span className="line-total">{rupees(i.lineTotal)}</span>
            <button className="link" onClick={() => removeItem(i.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="subtotal">
        Subtotal ({cart.itemCount} items): <strong>{rupees(cart.subtotal)}</strong>
      </p>
      <button className="btn primary" onClick={() => navigate('checkout')}>
        Checkout
      </button>
    </div>
  );
}
