/* eslint-disable @typescript-eslint/no-loss-of-precision */

import getIntegerPrecision from '@/src/getIntegerPrecision';

describe('getIntegerPrecision', () => {
  test('should return correct integer precision of number', () => {
    expect(getIntegerPrecision(123456789012345)).toEqual(15);
    expect(getIntegerPrecision(-123456789012345)).toEqual(15);
    expect(getIntegerPrecision(0.12345678901234567)).toEqual(0);
    expect(getIntegerPrecision(-0.12345678901234567)).toEqual(0);
    expect(getIntegerPrecision(0.123456789e-10)).toEqual(0);
    expect(getIntegerPrecision(-0.123456789e-10)).toEqual(0);
  });
});
