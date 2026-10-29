export function RestaurantHeader({ name, eta }) {
  return (
    <div className="restaurant-header">
      <span className="restaurant-header__name">{name}</span>
      <span className="restaurant-header__eta">{eta}</span>
    </div>
  );
}
