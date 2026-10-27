import { useState } from 'react';

const startedAt = Date.now();

export function OrderTimer() {
  const [seconds] = useState(() => Math.floor((Date.now() - startedAt) / 1000));

  return <p data-testid="elapsed">Elapsed: {seconds}s</p>;
}
