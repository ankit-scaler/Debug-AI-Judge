const LABELS = {
  all: 'All',
  italian: 'Italian',
  chinese: 'Chinese',
  'south-indian': 'South Indian',
};

export function cuisineLabel(cuisine) {
  return LABELS[cuisine] ?? cuisine;
}
