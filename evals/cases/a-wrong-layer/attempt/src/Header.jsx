import { useCart } from './CartContext.jsx';

export function Header() {
  const { count } = useCart();
  return (
    <header>
      <h1>Flipkart</h1>
      <span data-testid="cart-count">{count}</span>
    </header>
  );
}
