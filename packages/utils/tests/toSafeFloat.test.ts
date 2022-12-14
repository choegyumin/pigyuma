/* eslint-disable @typescript-eslint/no-loss-of-precision */

import toSafeFloat from '@/src/toSafeFloat';

describe('toSafeFloat', () => {
  test('should float number is rounded to 15 digits', () => {
    expect(toSafeFloat(0.00000000000000111111)).toBe(0.000000000000001);
    expect(toSafeFloat(0.00000000000000999999)).toBe(0.00000000000001);
    expect(toSafeFloat(0.99999999999999999999)).toBe(1);
  });

  test('should float number is safety', () => {
    expect(toSafeFloat(Number.MIN_SAFE_INTEGER - 0.99999999999999999999)).toBe(Number.MIN_SAFE_INTEGER);
    expect(toSafeFloat(Number.MAX_SAFE_INTEGER + 0.99999999999999999999)).toBe(Number.MAX_SAFE_INTEGER);
    expect(toSafeFloat(NaN)).toBe(0);
    expect(toSafeFloat(Infinity)).toBe(Number.MAX_SAFE_INTEGER);
    expect(toSafeFloat(-Infinity)).toBe(Number.MIN_SAFE_INTEGER);
  });
});
