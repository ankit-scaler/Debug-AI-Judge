import { useCart } from '../context/CartContext.jsx';

export function Notice() {
  const { notice, clearNotice } = useCart();
  if (!notice) return null;
  return (
    <div role="alert" className="notice" onClick={clearNotice}>
      {notice}
    </div>
  );
}
