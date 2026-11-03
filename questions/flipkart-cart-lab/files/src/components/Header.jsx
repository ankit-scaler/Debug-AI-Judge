import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useNav } from '../context/NavContext.jsx';

export function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { navigate } = useNav();
  return (
    <header className="site-header">
      <button className="logo" onClick={() => navigate('catalog')}>
        Flipkart
      </button>
      <nav>
        {user ? (
          <button className="link" onClick={logout}>
            Logout ({user.name.split(' ')[0]})
          </button>
        ) : (
          <button className="link" onClick={() => navigate('login')}>
            Login
          </button>
        )}
        <button className="cart-link" onClick={() => navigate('cart')}>
          Cart <span data-testid="cart-count" className="badge">{cart.itemCount}</span>
        </button>
      </nav>
    </header>
  );
}
