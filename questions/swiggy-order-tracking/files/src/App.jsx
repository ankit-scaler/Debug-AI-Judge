import './App.css';
import { OrderList } from './features/orders/OrderList.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Swiggy</h1>
        <span className="app-header__subtitle">Order tracking</span>
      </header>
      <main>
        <OrderList />
      </main>
    </div>
  );
}
