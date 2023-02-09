/* eslint-disable @typescript-eslint/no-loss-of-precision */

import getNumberPrecision from '@/src/getNumberPrecision';

describe('getNumberPrecision', () => {
  test('should return correct precision of number', () => {
    expect(getNumberPrecision(123456789012345)).toEqual(15);
    expect(getNumberPrecision(-123456789012345)).toEqual(15);
    expect(getNumberPrecision(0.12345678901234567)).toEqual(17);
    expect(getNumberPrecision(-0.12345678901234567)).toEqual(17);
    expect(getNumberPrecision(0.123456789e-10)).toEqual(19);
    expect(getNumberPrecision(-0.123456789e-10)).toEqual(19);
  });
});
