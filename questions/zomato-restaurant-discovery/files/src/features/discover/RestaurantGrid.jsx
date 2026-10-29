import { RestaurantCard } from '../../components/ui/RestaurantCard.jsx';
import { useRestaurants } from './useRestaurants.js';

export function RestaurantGrid({ cuisine }) {
  const { restaurants } = useRestaurants(cuisine);

  return (
    <ul className="restaurant-grid" data-testid="restaurant-grid">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </ul>
  );
}
