import './App.css';
import { SearchPage } from './features/search/SearchPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>MakeMyTrip</h1>
        <span className="app-header__subtitle">Flights</span>
      </header>
      <main>
        <SearchPage />
      </main>
    </div>
  );
}
