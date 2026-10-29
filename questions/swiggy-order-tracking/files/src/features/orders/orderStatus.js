export const STATUS_STEPS = ['Preparing', 'On the way', 'Delivered'];

export function stepIndex(status) {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
}
