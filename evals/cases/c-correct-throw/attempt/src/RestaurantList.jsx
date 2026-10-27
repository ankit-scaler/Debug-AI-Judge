import { useEffect, useState } from 'react';

export function RestaurantList({ city }) {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/restaurants?city=${city}`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setRestaurants(data.restaurants);
      } catch (err) {
        if (!cancelled) setError('Could not load restaurants. Please try again.');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (error) return <p role="alert">{error}</p>;

  return (
    <ul data-testid="restaurants">
      {restaurants.map((r) => (
        <li key={r.id}>{r.name}</li>
      ))}
    </ul>
  );
}
