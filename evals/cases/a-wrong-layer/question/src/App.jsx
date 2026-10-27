import { CartProvider } from './CartContext.jsx';
import { Header } from './Header.jsx';
import { ProductList } from './ProductList.jsx';
import { Cart } from './Cart.jsx';

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <ProductList />
        <Cart />
      </main>
    </CartProvider>
  );
}
