-- ============================================================================
-- Flipkart-lite seed data  ·  database/seed.sql
-- Static and deterministic: same rows, same ids, same password hashes every time.
-- Both demo users log in with the password `password123`.
-- (Password hashes are scrypt with a fixed salt, so this file never changes.)
-- ============================================================================

INSERT INTO users (id, email, name, password_salt, password_hash) VALUES
  (1, 'asha@example.com', 'Asha Verma', '9f3a61c2d84b7e05', '7588053dfed67cbc3fa39842c7a1a68ed2726d20ea39d62530185e599c4d0e0b'),
  (2, 'ravi@example.com', 'Ravi Nair',  '4be07d19a2c6f833', '9eca0af13ad7da8f2464d5ad5920fc9d33b3933ae799b7c5bd6593038d6efbc0');

-- price_paise: 249900 paise = ₹2,499.  stock = units available to sell.
INSERT INTO products (id, name, category, description, price_paise, stock) VALUES
  (42, 'Running Shoe',       'Footwear',    'Lightweight daily trainer with breathable mesh.', 249900,  8),
  (43, 'Yoga Mat',           'Fitness',     '6mm anti-slip mat, 183cm x 61cm.',                 89900,  5),
  (44, 'Wireless Earbuds',   'Electronics', 'Bluetooth 5.3, 28h battery with case.',           199900, 12),
  (45, 'Steel Water Bottle', 'Home',        '1L insulated bottle, keeps cold for 24h.',         69900, 20),
  (46, 'Cotton T-Shirt',     'Apparel',     'Regular fit, 100% combed cotton.',                 49900, 30),
  (47, 'Backpack 30L',       'Bags',        'Water-resistant daypack with laptop sleeve.',     159900,  6),
  (48, 'Desk Lamp',          'Home',        'LED lamp with 3 colour temperatures.',            119900,  9),
  (49, 'Dumbbell Set 10kg',  'Fitness',     'Pair of 5kg rubber-coated dumbbells.',            179900,  3),
  (50, 'Phone Case',         'Electronics', 'Shock-absorbing case, fits most 6.1" phones.',     29900, 40),
  (51, 'Sunglasses',         'Apparel',     'UV400 polarised lenses.',                          99900, 15);
