import { useCart } from './CartContext.jsx';

const PRODUCTS = [
  { id: 42, name: 'Running Shoe', price: 2499 },
  { id: 43, name: 'Yoga Mat', price: 899 },
];

export function ProductList() {
  const { addToCart } = useCart();
  return (
    <ul>
      {PRODUCTS.map((p) => (
        <li key={p.id}>
          {p.name}
          <button onClick={() => addToCart(p)}>Add to cart</button>
        </li>
      ))}
    </ul>
  );
}
