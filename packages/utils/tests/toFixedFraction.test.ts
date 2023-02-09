/* eslint-disable @typescript-eslint/no-loss-of-precision */

import toFixedFraction from '@/src/toFixedFraction';

describe('toFixedFraction', () => {
  test('should return fixed fraction digits number', () => {
    expect((0.111).toFixed()).toBe('0');
    expect(toFixedFraction(0.111)).toBe('0.111');
    expect(toFixedFraction(11111e-10)).toBe('0.0000011111');
    expect(toFixedFraction(0.11111e-10)).toBe('0.000000000011111');
  });

  test('should return fixed fraction digits number when passing digits', () => {
    expect(toFixedFraction(0.111, 5)).toBe('0.11100');
    expect(toFixedFraction(0.11111, 3)).toBe('0.111');
    expect(toFixedFraction(0.99999, 3)).toBe('1.000');
  });
});
