import { useEffect, useState } from 'react';

export function OrderTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return <p data-testid="elapsed">Elapsed: {seconds}s</p>;
}
