import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export function AddToCartButton({ product, quantity = 1 }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const soldOut = product.stock === 0;
  return (
    <button
      className="btn primary"
      disabled={soldOut}
      onClick={() => (user ? addToCart(product, quantity) : navigate('/login'))}
    >
      {soldOut ? 'Out of stock' : 'Add to cart'}
    </button>
  );
}
