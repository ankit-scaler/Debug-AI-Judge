import { useEffect, useRef, useState } from 'react';
import { onApiEvent } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

/**
 * Lab helper: open the preview in a new tab and add ?debug=1 to the URL (e.g.
 * .../preview/frame.html?debug=1) to see every "add to cart" response in the
 * order it ARRIVED, next to what the cart badge currently shows. Only works
 * in a real tab -- the embedded preview has no address bar to type a query
 * string into. You do not need to edit this file to solve the lab.
 */
export function DebugPanel() {
  const { cart } = useCart();
  const [rows, setRows] = useState([]);
  const taps = useRef(new Map()); // request id -> 1st, 2nd, 3rd tap in the order they were SENT

  useEffect(
    () =>
      onApiEvent((e) => {
        if (e.method !== 'POST' || !e.path.startsWith('/api/cart/items')) return;
        if (e.phase === 'sent') return void taps.current.set(e.sentAs, taps.current.size + 1);
        setRows((r) => [...r.slice(-11), { ...e, tap: taps.current.get(e.sentAs) }]);
      }),
    [],
  );

  return (
    <aside className="debug-panel" data-testid="debug-panel">
      <div className="debug-head">
        <strong>Request log</strong>
        <button
          className="link"
          onClick={() => {
            taps.current.clear();
            setRows([]);
          }}
        >
          clear
        </button>
      </div>
      <div className="debug-badge">
        Cart badge now shows: <b data-testid="debug-badge">{cart.itemCount}</b>
        <span className="muted"> (v{cart.version})</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>arrived</th>
            <th>tap #</th>
            <th>took</th>
            <th>HTTP</th>
            <th>cart v</th>
            <th>count</th>
            <th>lines</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{e.tap}</td>
              <td>{e.ms} ms</td>
              <td>{e.status}</td>
              <td>{e.version ?? '-'}</td>
              <td>{e.itemCount ?? '-'}</td>
              <td>{e.lines ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">Responses are listed in the order they arrived, not the order you tapped.</p>
    </aside>
  );
}
