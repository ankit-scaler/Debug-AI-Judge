import './App.css';
import { DiscoverPage } from './features/discover/DiscoverPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Zomato</h1>
        <span className="app-header__subtitle">Discover restaurants</span>
      </header>
      <main>
        <DiscoverPage />
      </main>
    </div>
  );
}
