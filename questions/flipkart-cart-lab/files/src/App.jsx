import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NavProvider, useNav } from './context/NavContext.jsx';
import { Header } from './components/Header.jsx';
import { Login } from './pages/Login.jsx';
import { Catalog } from './pages/Catalog.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { Orders } from './pages/Orders.jsx';

function Page() {
  const { page } = useNav();
  const { ready } = useAuth();
  if (!ready) return null;
  if (page === 'login') return <Login />;
  if (page === 'cart') return <CartPage />;
  if (page === 'checkout') return <Checkout />;
  if (page === 'orders') return <Orders />;
  return <Catalog />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavProvider>
        <CartProvider>
          <div className="app-shell">
            <Header />
            <main>
              <Page />
            </main>
          </div>
        </CartProvider>
      </NavProvider>
    </AuthProvider>
  );
}
