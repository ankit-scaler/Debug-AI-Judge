// Mock API for this question. Read-only.
const CITIES = [
  { code: 'DEL', name: 'Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'BLR', name: 'Bengaluru' },
  { code: 'HYD', name: 'Hyderabad' },
];

const FLIGHTS_BY_ROUTE = {
  'DEL-BOM': [
    { id: 'f1', airline: 'IndiGo', from: 'DEL', to: 'BOM', departure: '06:15', duration: '2h 10m', price: 4899 },
    { id: 'f2', airline: 'Air India', from: 'DEL', to: 'BOM', departure: '09:40', duration: '2h 20m', price: 5299 },
  ],
  'BLR-HYD': [
    { id: 'f3', airline: 'SpiceJet', from: 'BLR', to: 'HYD', departure: '07:05', duration: '1h 5m', price: 2899 },
    { id: 'f4', airline: 'IndiGo', from: 'BLR', to: 'HYD', departure: '11:30', duration: '1h 10m', price: 3199 },
  ],
};

// DEL-BOM is deliberately much slower than BLR-HYD so that searching DEL-BOM
// and then quickly searching BLR-HYD reliably reproduces the race: the faster
// second response arrives first, and the slower first response arrives after
// it, giving a buggy handler a real opportunity to overwrite the newer result.
const ROUTE_DELAY_MS = {
  'DEL-BOM': 1500,
  'BLR-HYD': 250,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const handlers = [
  {
    method: 'GET',
    path: '/api/cities',
    handler: async () => ({ status: 200, body: { cities: CITIES } }),
  },
  {
    method: 'GET',
    path: '/api/flights/search',
    handler: async (req) => {
      const url = new URL(req.url, location.origin);
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');
      const routeKey = `${from}-${to}`;
      await delay(ROUTE_DELAY_MS[routeKey] ?? 400);
      return { status: 200, body: { flights: FLIGHTS_BY_ROUTE[routeKey] ?? [] } };
    },
  },
];
