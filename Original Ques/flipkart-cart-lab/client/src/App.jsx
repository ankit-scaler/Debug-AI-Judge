import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Header } from './components/Header.jsx';
import { Catalog } from './pages/Catalog.jsx';
import { ProductPage } from './pages/ProductPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { Orders } from './pages/Orders.jsx';
import { Login } from './pages/Login.jsx';
import { DebugPanel } from './components/DebugPanel.jsx';
import { debugEnabled } from './debug.js';

// Decided once per page load: ?debug=1 turns the panel on and it is remembered (see debug.js).
const SHOW_DEBUG = debugEnabled();

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Protected><CartPage /></Protected>} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {SHOW_DEBUG && <DebugPanel />}
    </>
  );
}
