import { RestaurantList } from './RestaurantList.jsx';

export default function App() {
  return (
    <main>
      <h1>Restaurants near you</h1>
      <RestaurantList city="indore" />
    </main>
  );
}
