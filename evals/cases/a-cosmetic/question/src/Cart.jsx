import { useCart } from './CartContext.jsx';

export function Cart() {
  const { items } = useCart();
  if (items.length === 0) return <p>Your cart is empty.</p>;
  return (
    <ul data-testid="cart">
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
