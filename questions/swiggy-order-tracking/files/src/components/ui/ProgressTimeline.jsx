import { STATUS_STEPS, stepIndex } from '../../features/orders/orderStatus.js';

export function ProgressTimeline({ status }) {
  const current = stepIndex(status);
  return (
    <ol className="progress-timeline">
      {STATUS_STEPS.map((step, i) => (
        <li
          key={step}
          className={
            i <= current
              ? 'progress-timeline__step progress-timeline__step--done'
              : 'progress-timeline__step'
          }
        >
          {step}
        </li>
      ))}
    </ol>
  );
}
