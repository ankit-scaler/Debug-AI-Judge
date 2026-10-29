import { useState } from 'react';

export function useFlightSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  async function search(fromCode, toCode) {
    setFrom(fromCode);
    setTo(toCode);
    setLoading(true);
    const res = await fetch(`/api/flights/search?from=${fromCode}&to=${toCode}`);
    const data = await res.json();
    setResults(data.flights);
    setLoading(false);
  }

  return { results, loading, from, to, search };
}
