import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  return (
    <header className="site-header">
      <Link to="/" className="logo">Flipkart</Link>
      <nav>
        {user && <Link to="/orders">Orders</Link>}
        {user ? (
          <button className="link" onClick={logout}>Logout ({user.name.split(' ')[0]})</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/cart" className="cart-link">
          Cart <span data-testid="cart-count" className="badge">{cart.itemCount}</span>
        </Link>
      </nav>
    </header>
  );
}
