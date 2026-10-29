export function RestaurantCard({ restaurant }) {
  return (
    <li className="restaurant-card" data-testid="restaurant-card">
      <span className="restaurant-card__name">{restaurant.name}</span>
      <span className="restaurant-card__meta">
        {restaurant.cuisine} {'·'} {'★'} {restaurant.rating}
      </span>
    </li>
  );
}
