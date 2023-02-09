/* eslint-disable @typescript-eslint/no-loss-of-precision */

import toCorrectFloat from '@/src/toCorrectFloat';

describe('toCorrectFloat', () => {
  test('should fix floating point error', () => {
    expect(toCorrectFloat(0.1 + 0.2)).toBe(0.3);
    expect(toCorrectFloat(-0.1 + -0.2)).toBe(-0.3);
    expect(toCorrectFloat(5.33 + 5.2)).toBe(10.53);
    expect(toCorrectFloat(93.42 + 1.59 + 6.09)).toBe(101.1);
    expect(toCorrectFloat(8.84 - 6.41)).toBe(2.43);
    expect(toCorrectFloat(99.27 / 3)).toBe(33.09);
    expect(toCorrectFloat(7.7 * 2.72)).toBe(20.944);
  });

  test('Should return value without conversion when value has not floating-point errors', () => {
    expect(toCorrectFloat(0.12345678)).toBe(0.12345678);
    expect(toCorrectFloat(-0.12345678)).toBe(-0.12345678);
    expect(toCorrectFloat(123456789012345)).toBe(123456789012345);
    expect(toCorrectFloat(0.1234567890123456)).toBe(0.1234567890123456);
    expect(toCorrectFloat(1.234567890123456)).toBe(1.234567890123456);
    expect(toCorrectFloat(12.34567890123456)).toBe(12.34567890123456);
  });
});
