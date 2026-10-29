import { useEffect, useState } from 'react';
import { getJson } from '../../lib/apiClient.js';
import { cuisineLabel } from './restaurantTypes.js';

export function FilterSidebar({ selected, onSelect }) {
  const [cuisines, setCuisines] = useState(['all']);

  useEffect(() => {
    getJson('/api/cuisines').then((data) => setCuisines(data.cuisines));
  }, []);

  return (
    <aside className="filter-sidebar">
      <h3>Cuisine</h3>
      <ul>
        {cuisines.map((cuisine) => (
          <li key={cuisine}>
            <button
              className={
                cuisine === selected
                  ? 'filter-sidebar__item filter-sidebar__item--active'
                  : 'filter-sidebar__item'
              }
              onClick={() => onSelect(cuisine)}
              data-testid={`filter-${cuisine}`}
            >
              {cuisineLabel(cuisine)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
