import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('../api.js', () => ({
  api: vi.fn(),
  ApiError: class ApiError extends Error {},
}));

import { api } from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartProvider, useCart } from '../context/CartContext.jsx';

const cartAt = (version, quantity) => ({
  cartId: 1,
  version,
  items: [{ lineId: 1, productId: 42, name: 'Running Shoe', unitPrice: 100, quantity, lineTotal: 100 * quantity }],
  itemCount: quantity,
  subtotal: 100 * quantity,
});
const EMPTY = { cartId: 1, version: 0, items: [], itemCount: 0, subtotal: 0 };

function deferred() {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
}

let ctx;
let container;
let root;
const count = () => container.querySelector('[data-testid="count"]').textContent;
function Probe() {
  ctx = useCart();
  return <span data-testid="count">{ctx.cart.itemCount}</span>;
}

function setup() {
  const pending = [];
  api.mockImplementation((method) => {
    if (method === 'GET') return Promise.resolve(EMPTY);
    const d = deferred();
    pending.push(d);
    return d.promise;
  });
  container = document.createElement('div');
  root = createRoot(container);
  act(() => {
    root.render(
      <AuthContext.Provider value={{ user: { id: 1 }, ready: true }}>
        <CartProvider>
          <Probe />
        </CartProvider>
      </AuthContext.Provider>
    );
  });
  return pending;
}

beforeEach(() => {
  api.mockReset();
});
afterEach(() => {
  act(() => root?.unmount());
});

describe('CartContext with out-of-order responses', () => {
  it('applies responses that arrive in order', async () => {
    const pending = setup();
    await act(async () => {});
    await act(async () => {
      ctx.addToCart({ id: 42 });
      ctx.addToCart({ id: 42 });
    });
    await act(async () => {
      pending[0].resolve(cartAt(1, 1));
      pending[1].resolve(cartAt(2, 2));
    });
    expect(count()).toBe('2');
  });

  it('does not let a stale response overwrite a newer cart', async () => {
    const pending = setup();
    await act(async () => {});
    await act(async () => {
      ctx.addToCart({ id: 42 });
      ctx.addToCart({ id: 42 });
      ctx.addToCart({ id: 42 });
    });
    // Server processed them as v1, v2, v3 but the responses come back 3, 1, 2.
    await act(async () => pending[2].resolve(cartAt(3, 3)));
    await act(async () => pending[0].resolve(cartAt(1, 1)));
    await act(async () => pending[1].resolve(cartAt(2, 2)));
    expect(count()).toBe('3');
  });
});
