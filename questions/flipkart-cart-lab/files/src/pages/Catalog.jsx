import { useEffect, useState } from 'react';
import { api, rupees } from '../api.js';
import { AddToCartButton } from '../components/AddToCartButton.jsx';
import { Notice } from '../components/Notice.jsx';

const CATEGORIES = ['Footwear', 'Fitness', 'Accessories'];

export function Catalog() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams({ q, category });
    api('GET', `/api/products?${params}`)
      .then((r) => setProducts(r.products))
      .catch(() => {});
  }, [q, category]);

  return (
    <>
      <Notice />
      <div className="toolbar">
        <input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          <button className={!category ? 'chip active' : 'chip'} onClick={() => setCategory('')}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={category === c ? 'chip active' : 'chip'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="grid">
        {products.map((p) => (
          <li key={p.id} className="card product">
            <span className="product-name">{p.name}</span>
            <span className="price">{rupees(p.price)}</span>
            {p.stock > 0 && p.stock <= 5 && <span className="low">Only {p.stock} left</span>}
            <AddToCartButton product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
