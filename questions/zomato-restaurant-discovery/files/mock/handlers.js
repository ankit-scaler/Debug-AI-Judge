// Mock API for this question. Read-only.
const RESTAURANTS = {
  all: [
    { id: 1, name: 'Spice Route', cuisine: 'chinese', rating: 4.2 },
    { id: 2, name: 'Curry Leaf', cuisine: 'south-indian', rating: 4.5 },
  ],
  chinese: [{ id: 1, name: 'Spice Route', cuisine: 'chinese', rating: 4.2 }],
  'south-indian': [{ id: 2, name: 'Curry Leaf', cuisine: 'south-indian', rating: 4.5 }],
};

export const handlers = [
  {
    method: 'GET',
    path: '/api/cuisines',
    handler: async () => ({
      status: 200,
      body: { cuisines: ['all', 'italian', 'chinese', 'south-indian'] },
    }),
  },
  {
    method: 'GET',
    path: '/api/restaurants',
    handler: async (req) => {
      const url = new URL(req.url, location.origin);
      const cuisine = url.searchParams.get('cuisine') ?? 'all';
      // The upstream restaurant service is down for this one cuisine. Every
      // other cuisine responds normally.
      if (cuisine === 'italian') {
        return {
          status: 503,
          body: { error: 'Restaurant service is temporarily unavailable for this cuisine.' },
        };
      }
      return { status: 200, body: { restaurants: RESTAURANTS[cuisine] ?? [] } };
    },
  },
];
