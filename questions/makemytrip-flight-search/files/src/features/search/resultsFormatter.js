export function formatRouteLabel(from, to) {
  if (!from || !to) return 'Search for flights';
  return `${from} → ${to}`;
}

export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}
