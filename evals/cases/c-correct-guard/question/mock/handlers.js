// Mock API for this question. Read-only.
const BY_CITY = {
  bengaluru: [
    { id: 1, name: 'Truffles' },
    { id: 2, name: 'CTR' },
  ],
};

export const handlers = [
  {
    method: 'GET',
    path: '/api/restaurants',
    handler: async (req) => {
      const city = new URL(req.url, 'http://localhost').searchParams.get('city');
      const list = BY_CITY[city];
      if (!list) {
        // The upstream service returns 500 for cities it has not onboarded yet.
        return { status: 500, body: { error: 'upstream timeout' } };
      }
      return { status: 200, body: { restaurants: list } };
    },
  },
];
