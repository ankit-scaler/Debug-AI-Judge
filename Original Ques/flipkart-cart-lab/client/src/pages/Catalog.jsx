import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, rupees } from '../api.js';
import { AddToCartButton } from '../components/AddToCartButton.jsx';
import { Notice } from '../components/Notice.jsx';

export function Catalog() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [data, setData] = useState({ products: [], categories: [] });

  useEffect(() => {
    const params = new URLSearchParams({ q, category });
    api('GET', `/api/products?${params}`).then(setData).catch(() => {});
  }, [q, category]);

  return (
    <>
      <Notice />
      <div className="toolbar">
        <input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          <button className={!category ? 'chip active' : 'chip'} onClick={() => setCategory('')}>All</button>
          {data.categories.map((c) => (
            <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="grid">
        {data.products.map((p) => (
          <li key={p.id} className="card product">
            <Link to={`/product/${p.id}`}>{p.name}</Link>
            <span className="price">{rupees(p.price)}</span>
            {p.stock > 0 && p.stock <= 5 && <span className="low">Only {p.stock} left</span>}
            <AddToCartButton product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
