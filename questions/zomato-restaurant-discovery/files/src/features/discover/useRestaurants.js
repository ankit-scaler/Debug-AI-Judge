import { useEffect, useState } from 'react';

export function useRestaurants(cuisine) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`/api/restaurants?cuisine=${cuisine}`)
      .then((res) => res.json())
      .then((data) => setRestaurants(data.restaurants));
  }, [cuisine]);

  return { restaurants };
}
