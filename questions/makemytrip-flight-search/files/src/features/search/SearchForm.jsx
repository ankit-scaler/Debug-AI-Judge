import { useEffect, useState } from 'react';
import { getJson } from '../../lib/apiClient.js';

export function SearchForm({ onSearch, loading }) {
  const [cities, setCities] = useState([]);
  const [from, setFrom] = useState('DEL');
  const [to, setTo] = useState('BOM');

  useEffect(() => {
    getJson('/api/cities').then((data) => setCities(data.cities));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(from, to);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label>
        From
        <select value={from} onChange={(e) => setFrom(e.target.value)} data-testid="from-select">
          {cities.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        To
        <select value={to} onChange={(e) => setTo(e.target.value)} data-testid="to-select">
          {cities.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {/* Deliberately NOT disabled while `loading` -- a learner who fixes this
          bug by disabling the button during a search would make it impossible
          to ever trigger a second overlapping request, which only hides the
          race rather than handling it. */}
      <button type="submit" disabled={cities.length === 0} data-testid="search-submit">
        {loading ? 'Searching…' : 'Search flights'}
      </button>
    </form>
  );
}
