import { formatPrice } from '../../features/search/resultsFormatter.js';

export function FlightCard({ flight }) {
  return (
    <li className="flight-card" data-testid="flight-card">
      <span className="flight-card__airline">{flight.airline}</span>
      <span className="flight-card__route">
        {flight.from} {'→'} {flight.to}
      </span>
      <span className="flight-card__time">
        {flight.departure} {'·'} {flight.duration}
      </span>
      <span className="flight-card__price">{formatPrice(flight.price)}</span>
    </li>
  );
}
