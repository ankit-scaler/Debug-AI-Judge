import { SearchForm } from './SearchForm.jsx';
import { SearchResults } from './SearchResults.jsx';
import { useFlightSearch } from './useFlightSearch.js';

export function SearchPage() {
  const { results, loading, from, to, search } = useFlightSearch();

  return (
    <div className="search-page">
      <SearchForm onSearch={search} loading={loading} />
      <SearchResults results={results} loading={loading} from={from} to={to} />
    </div>
  );
}
