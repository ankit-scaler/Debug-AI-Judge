import { FlightCard } from '../../components/ui/FlightCard.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { formatRouteLabel } from './resultsFormatter.js';

export function SearchResults({ results, loading, from, to }) {
  return (
    <section className="search-results" data-testid="search-results">
      <h2>{formatRouteLabel(from, to)}</h2>
      {loading ? <Spinner /> : null}
      {!loading && results.length === 0 ? (
        <p className="search-results__empty">No flights found.</p>
      ) : null}
      <ul>
        {results.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </ul>
    </section>
  );
}
