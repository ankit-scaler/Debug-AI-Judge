// Mock API for this question. Read-only.
const ORDERS = [
  { id: 101, restaurant: 'Spice Villa', eta: '25-30 min', status: 'Preparing' },
  { id: 102, restaurant: 'Noodle House', eta: '15-20 min', status: 'Preparing' },
];

// Each order has its own literal status endpoint because the preview's fetch
// interceptor matches on an exact pathname, not a pattern. Every call advances
// that order's own step counter, so repeatedly polling the same order looks
// like a real delivery progressing over time.
function makeStatusHandler(path, steps) {
  let pollCount = 0;
  return {
    method: 'GET',
    path,
    handler: async () => {
      const idx = Math.min(pollCount, steps.length - 1);
      pollCount += 1;
      return { status: 200, body: { status: steps[idx] } };
    },
  };
}

export const handlers = [
  {
    method: 'GET',
    path: '/api/orders',
    handler: async () => ({ status: 200, body: { orders: ORDERS } }),
  },
  makeStatusHandler('/api/orders/101/status', [
    'Preparing',
    'Preparing',
    'On the way',
    'On the way',
    'Delivered',
  ]),
  makeStatusHandler('/api/orders/102/status', [
    'Preparing',
    'On the way',
    'On the way',
    'Delivered',
    'Delivered',
  ]),
];
