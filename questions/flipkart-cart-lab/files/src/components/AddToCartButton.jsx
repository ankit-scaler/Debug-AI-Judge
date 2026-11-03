import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useNav } from '../context/NavContext.jsx';

export function AddToCartButton({ product, quantity = 1 }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { navigate } = useNav();
  const soldOut = product.stock === 0;
  return (
    <button
      className="btn primary"
      disabled={soldOut}
      data-testid={`add-to-cart-${product.id}`}
      onClick={() => (user ? addToCart(product, quantity) : navigate('login'))}
    >
      {soldOut ? 'Out of stock' : 'Add to cart'}
    </button>
  );
}
