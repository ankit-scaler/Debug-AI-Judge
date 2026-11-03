import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError } from '../api.js';
import { useAuth } from './AuthContext.jsx';

const EMPTY = { cartId: null, version: 0, items: [], itemCount: 0, subtotal: 0 };

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [notice, setNotice] = useState(null);

  // Load the server cart whenever the signed-in user changes.
  useEffect(() => {
    if (!user) return setCart(EMPTY);
    api('GET', '/api/cart').then(setCart).catch(() => {});
  }, [user]);

  const mutate = useCallback(async (method, path, body) => {
    try {
      const next = await api(method, path, body);
      setCart(next);
      setNotice(null);
      return { ok: true };
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setNotice(
          e.body.available > 0
            ? `Only ${e.body.available} more available.`
            : 'Sorry, this item is out of stock.',
        );
      } else {
        setNotice('Something went wrong. Please try again.');
      }
      return { ok: false, error: e };
    }
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => mutate('POST', '/api/cart/items', { productId: product.id, quantity }),
    [mutate],
  );
  const setQuantity = useCallback(
    (productId, quantity) => mutate('PATCH', `/api/cart/items/${productId}`, { quantity }),
    [mutate],
  );
  const removeItem = useCallback(
    (productId) => mutate('DELETE', `/api/cart/items/${productId}`),
    [mutate],
  );
  const refresh = useCallback(() => api('GET', '/api/cart').then(setCart), []);

  return (
    <CartContext.Provider
      value={{ cart, notice, addToCart, setQuantity, removeItem, refresh, clearNotice: () => setNotice(null) }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
