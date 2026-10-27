// Mock API for this question. Read-only.
const cart = { items: [] };

const PRODUCTS = {
  42: { id: 42, name: 'Running Shoe', price: 2499 },
  43: { id: 43, name: 'Yoga Mat', price: 899 },
};

export const handlers = [
  {
    method: 'POST',
    path: '/api/cart',
    handler: async (req) => {
      const { productId } = JSON.parse(req.body);
      cart.items = [...cart.items, PRODUCTS[productId]];
      // Response shape mirrors the real cart service.
      return {
        status: 200,
        body: { cart: { items: cart.items, total: cart.items.length } },
      };
    },
  },
];
