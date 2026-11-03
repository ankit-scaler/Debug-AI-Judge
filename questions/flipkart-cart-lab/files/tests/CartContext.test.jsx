// Ported from the real lab's client/src/__tests__/CartContext.test.jsx. The
// original mocks api.js's module export directly; this harness has no module
// mocking, so api.js exposes a test-only __setFetchOverride hook instead
// (see src/api.js) -- same isolation, same determinism: CartContext's own
// ordering bug is tested independent of whether the mock server is correct.
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { AuthContext } from '../src/context/AuthContext.jsx';
import { CartProvider, useCart } from '../src/context/CartContext.jsx';
import { __setFetchOverride } from '../src/api.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { it, expect } = globalThis.__debuglab_harness__;

const cartAt = (version, quantity) => ({
  cartId: 1,
  version,
  items: [{ lineId: 1, productId: 42, name: 'Running Shoe', unitPrice: 100, quantity, lineTotal: 100 * quantity }],
  itemCount: quantity,
  subtotal: 100 * quantity,
});
const EMPTY_CART = { cartId: 1, version: 0, items: [], itemCount: 0, subtotal: 0 };

function deferred() {
  let resolve;
  const promise = new Promise((r) => (resolve = r));
  return { promise, resolve };
}

function fakeResponse(body) {
  return { ok: true, status: 200, json: async () => body };
}

async function setup() {
  const pending = [];
  __setFetchOverride((_path, init) => {
    if (!init || init.method === 'GET' || !init.method) return Promise.resolve(fakeResponse(EMPTY_CART));
    const d = deferred();
    pending.push(d);
    return d.promise.then(fakeResponse);
  });

  let ctx;
  function Probe() {
    ctx = useCart();
    return null;
  }
  const container = document.createElement('div');
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <AuthContext.Provider value={{ user: { id: 1, name: 'Asha' }, ready: true }}>
        <CartProvider>
          <Probe />
        </CartProvider>
      </AuthContext.Provider>,
    );
  });
  await act(async () => {}); // flush the initial GET /api/cart
  return { pending, getCtx: () => ctx, root };
}

function teardown(root) {
  __setFetchOverride(null);
  act(() => root.unmount());
}

it('applies responses that arrive in order', async () => {
  const { pending, getCtx, root } = await setup();
  await act(async () => {
    getCtx().addToCart({ id: 42 });
    getCtx().addToCart({ id: 42 });
  });
  await act(async () => {
    pending[0].resolve(cartAt(1, 1));
    pending[1].resolve(cartAt(2, 2));
  });
  expect(getCtx().cart.itemCount).toBe(2);
  teardown(root);
});

it('does not let a stale response overwrite a newer cart', async () => {
  const { pending, getCtx, root } = await setup();
  await act(async () => {
    getCtx().addToCart({ id: 42 });
    getCtx().addToCart({ id: 42 });
    getCtx().addToCart({ id: 42 });
  });
  // Server processed them as v1, v2, v3 but the responses come back 3, 1, 2.
  await act(async () => pending[2].resolve(cartAt(3, 3)));
  await act(async () => pending[0].resolve(cartAt(1, 1)));
  await act(async () => pending[1].resolve(cartAt(2, 2)));
  expect(getCtx().cart.itemCount).toBe(3);
  teardown(root);
});
