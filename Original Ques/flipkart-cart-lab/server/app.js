import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { authRoutes } from './routes/auth.js';
import { productRoutes } from './routes/products.js';
import { cartRoutes } from './routes/cart.js';
import { orderRoutes } from './routes/orders.js';
import { createPricingService } from './services/pricing.js';
import { latency } from './middleware.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp(db, { jitter = true, pricing } = {}) {
  const app = express();
  app.use(express.json());
  if (jitter) app.use('/api', latency());

  const pricingSvc = pricing || createPricingService(db);
  app.use('/api/auth', authRoutes(db));
  app.use('/api/products', productRoutes(db));
  app.use('/api/cart', cartRoutes(db, pricingSvc));
  app.use('/api/orders', orderRoutes(db));

  const dist = path.join(here, '..', 'client', 'dist');
  if (existsSync(dist)) {
    app.use(express.static(dist));
    app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'INTERNAL' });
  });
  return app;
}
