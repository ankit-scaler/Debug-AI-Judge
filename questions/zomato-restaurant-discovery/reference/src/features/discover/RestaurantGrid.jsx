import { RestaurantCard } from '../../components/ui/RestaurantCard.jsx';
import { ErrorBanner } from '../../components/ui/ErrorBanner.jsx';
import { useRestaurants } from './useRestaurants.js';

export function RestaurantGrid({ cuisine }) {
  const { restaurants, error } = useRestaurants(cuisine);

  if (error) {
    return (
      <ErrorBanner message="We could not load restaurants for this filter. Please try again." />
    );
  }

  return (
    <ul className="restaurant-grid" data-testid="restaurant-grid">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </ul>
  );
}
