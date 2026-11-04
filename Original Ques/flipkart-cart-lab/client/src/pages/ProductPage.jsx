import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, rupees } from '../api.js';
import { AddToCartButton } from '../components/AddToCartButton.jsx';
import { Notice } from '../components/Notice.jsx';

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api('GET', `/api/products/${id}`).then((r) => setProduct(r.product)).catch(() => setProduct(false));
  }, [id]);

  if (product === false) return <p>Product not found.</p>;
  if (!product) return null;
  return (
    <div className="card detail">
      <Notice />
      <h2>{product.name}</h2>
      <p className="muted">{product.category}</p>
      <p>{product.description}</p>
      <p className="price">{rupees(product.price)}</p>
      <label>
        Qty
        <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
        </select>
      </label>
      <AddToCartButton product={product} quantity={qty} />
    </div>
  );
}
