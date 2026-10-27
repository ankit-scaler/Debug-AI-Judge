import { useEffect, useState } from 'react';

export function OrderTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, []);

  return <p data-testid="elapsed">Elapsed: {seconds}s</p>;
}
