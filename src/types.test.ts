import { expect, test } from 'vitest';
import { CRITERION_KINDS } from './types.js';

test('every rubric criterion kind is representable', () => {
  expect(CRITERION_KINDS).toEqual([
    'root_cause',
    'behaviour',
    'anti_shortcut',
    'no_regression',
  ]);
});
