import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar.jsx';
import { RestaurantGrid } from './RestaurantGrid.jsx';

export function DiscoverPage() {
  const [cuisine, setCuisine] = useState('all');

  return (
    <div className="discover-page">
      <FilterSidebar selected={cuisine} onSelect={setCuisine} />
      <RestaurantGrid cuisine={cuisine} />
    </div>
  );
}
