import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartLines, setCartLines] = useState([]);

  async function addToCart(selectedProduct) {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: selectedProduct.id }),
    });

    const payload = await response.json();

    setCartLines(payload.items || []);
  }

  return (
    <CartContext.Provider value={{ items: cartLines, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
