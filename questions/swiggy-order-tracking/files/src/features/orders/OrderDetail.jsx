import { useOrderTimer } from './useOrderTimer.js';
import { RestaurantHeader } from '../restaurant/RestaurantHeader.jsx';
import { ProgressTimeline } from '../../components/ui/ProgressTimeline.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

export function OrderDetail({ order }) {
  const status = useOrderTimer(order.id);

  return (
    <section className="order-detail" data-testid="order-detail">
      <RestaurantHeader name={order.restaurant} eta={order.eta} />
      <Badge tone="info">Order #{order.id}</Badge>
      <ProgressTimeline status={status ?? order.status} />
      <p className="order-detail__status-line" data-testid="order-status-line">
        {status ?? order.status}
      </p>
    </section>
  );
}
