import { useCart } from './CartContext.jsx';

export function Header() {
  const { items } = useCart();
  return (
    <header>
      <h1>Flipkart</h1>
      <span data-testid="cart-count">{items.length}</span>
    </header>
  );
}
