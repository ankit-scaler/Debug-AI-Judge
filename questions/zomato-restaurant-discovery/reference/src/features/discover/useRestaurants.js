import { useEffect, useState } from 'react';

export function useRestaurants(cuisine) {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    fetch(`/api/restaurants?cuisine=${cuisine}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body) => {
            throw new Error(body?.error || `Request failed with status ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setRestaurants(data.restaurants);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [cuisine]);

  return { restaurants, error };
}
