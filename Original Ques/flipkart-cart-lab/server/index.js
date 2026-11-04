import { openOrBuildDb, buildDb } from './db.js';
import { createApp } from './app.js';
import { createPricingService } from './services/pricing.js';

const file = process.env.DB_FILE;
const db = file === ':memory:' ? buildDb(':memory:') : openOrBuildDb(file || undefined);

// The pricing service is a (slow) network call in real life. A fixed delay keeps the lab
// deterministic: every tap within that window overlaps with the previous ones.
const pricingMs = Number(process.env.PRICING_MS ?? 500);
const pricing = createPricingService(db, { minMs: pricingMs, maxMs: pricingMs });

const port = Number(process.env.PORT || 3001);
createApp(db, { jitter: process.env.JITTER !== 'off', pricing }).listen(port, () =>
  console.log(`Flipkart-lite API listening on http://localhost:${port}`)
);
