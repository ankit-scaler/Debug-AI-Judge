import { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NavProvider, useNav } from './context/NavContext.jsx';
import { Header } from './components/Header.jsx';
import { DebugPanel } from './components/DebugPanel.jsx';
import { Login } from './pages/Login.jsx';
import { Catalog } from './pages/Catalog.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { Checkout } from './pages/Checkout.jsx';

const DEBUG_KEY = 'fk_debug';

function useDebugFlag() {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(DEBUG_KEY) === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('debug')) {
      const next = params.get('debug') === '1';
      try {
        localStorage.setItem(DEBUG_KEY, next ? '1' : '0');
      } catch {
        /* storage unavailable */
      }
      setOn(next);
    }
  }, []);
  return on;
}

function Page() {
  const { page } = useNav();
  const { ready } = useAuth();
  if (!ready) return null;
  if (page === 'login') return <Login />;
  if (page === 'cart') return <CartPage />;
  if (page === 'checkout') return <Checkout />;
  return <Catalog />;
}

export default function App() {
  const debug = useDebugFlag();
  return (
    <AuthProvider>
      <NavProvider>
        <CartProvider>
          <div className="app-shell">
            <Header />
            <main>
              <Page />
            </main>
            {debug ? <DebugPanel /> : null}
          </div>
        </CartProvider>
      </NavProvider>
    </AuthProvider>
  );
}
