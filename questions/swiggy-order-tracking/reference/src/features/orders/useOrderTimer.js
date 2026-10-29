import { useEffect, useState } from 'react';

/**
 * Polls the given order's live status every 2 seconds.
 */
export function useOrderTimer(orderId) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(null);
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}/status`);
      const data = await res.json();
      setStatus(data.status);
    }, 2000);
    return () => clearInterval(interval);
  }, [orderId]);

  return status;
}
