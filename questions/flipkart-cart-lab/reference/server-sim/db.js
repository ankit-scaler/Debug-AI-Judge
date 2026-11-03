// In-memory stand-in for the real lab's SQLite database. Shapes mirror
// database/schema.sql closely enough that the ported tests' assertions
// (field names, subtotal math) read the same as the real lab's.

export const PRODUCTS = [
  { id: 42, name: 'Running Shoe', category: 'Footwear', pricePaise: 249900, stock: 10 },
  { id: 43, name: 'Yoga Mat', category: 'Fitness', pricePaise: 89900, stock: 5 },
  { id: 44, name: 'Resistance Band', category: 'Accessories', pricePaise: 59900, stock: 6 },
  { id: 45, name: 'Water Bottle', category: 'Accessories', pricePaise: 39900, stock: 8 },
  { id: 46, name: 'Gym Towel', category: 'Accessories', pricePaise: 19900, stock: 8 },
  { id: 49, name: 'Dumbbell Set', category: 'Fitness', pricePaise: 349900, stock: 3 },
  { id: 50, name: 'Yoga Block', category: 'Fitness', pricePaise: 29900, stock: 4 },
];

export const USERS = [
  { id: 1, email: 'asha@example.com', name: 'Asha', password: 'password123' },
  { id: 2, email: 'ravi@example.com', name: 'Ravi', password: 'password123' },
];

/** Fresh store per test run / per preview run -- never shared across them. */
export function createStore() {
  let nextCartItemId = 1;
  let nextCartId = 1;
  let nextOrderId = 1;

  return {
    carts: [], // { id, userId, version }
    cartItems: [], // { id, cartId, productId, quantity }
    products: PRODUCTS.map((p) => ({ ...p })), // stock mutates on checkout
    orders: [], // { id, userId, address, totalPaise, items: [...] }

    getOrCreateCart(userId) {
      let cart = this.carts.find((c) => c.userId === userId);
      if (!cart) {
        cart = { id: nextCartId++, userId, version: 0 };
        this.carts.push(cart);
      }
      return cart;
    },

    findCartItem(cartId, productId) {
      return this.cartItems.find((ci) => ci.cartId === cartId && ci.productId === productId);
    },

    // Fixed: mirrors the real fix's UNIQUE(cart_id, product_id) constraint.
    // Defense in depth -- stops a duplicate row from ever being written, by
    // anything, even if a future route forgets the application-level fix.
    insertCartItemDirect(cartId, productId, quantity) {
      if (this.findCartItem(cartId, productId)) {
        throw new Error('UNIQUE constraint failed: cart_items.cart_id, cart_items.product_id');
      }
      const row = { id: nextCartItemId++, cartId, productId, quantity };
      this.cartItems.push(row);
      return row;
    },

    loadCart(cartId) {
      const cart = this.carts.find((c) => c.id === cartId);
      const items = this.cartItems
        .filter((ci) => ci.cartId === cartId)
        .sort((a, b) => a.id - b.id)
        .map((ci) => {
          const product = this.products.find((p) => p.id === ci.productId);
          return {
            lineId: ci.id,
            productId: ci.productId,
            name: product.name,
            unitPrice: product.pricePaise,
            stock: product.stock,
            quantity: ci.quantity,
            lineTotal: product.pricePaise * ci.quantity,
          };
        });
      return {
        cartId: cart.id,
        version: cart.version,
        items,
        itemCount: items.reduce((n, i) => n + i.quantity, 0),
        subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      };
    },

    cartRowsFor(email) {
      const user = USERS.find((u) => u.email === email);
      const cart = user && this.carts.find((c) => c.userId === user.id);
      if (!cart) return [];
      return this.cartItems
        .filter((ci) => ci.cartId === cart.id)
        .sort((a, b) => a.id - b.id)
        .map((ci) => ({ productId: ci.productId, quantity: ci.quantity }));
    },

    bumpVersion(cartId) {
      const cart = this.carts.find((c) => c.id === cartId);
      cart.version += 1;
    },

    nextOrderId: () => nextOrderId++,
  };
}
