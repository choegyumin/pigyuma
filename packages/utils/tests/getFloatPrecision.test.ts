/* eslint-disable @typescript-eslint/no-loss-of-precision */

import getFloatPrecision from '@/src/getFloatPrecision';

describe('getFloatPrecision', () => {
  test('should return correct float precision of number', () => {
    expect(getFloatPrecision(123456789012345)).toEqual(0);
    expect(getFloatPrecision(-123456789012345)).toEqual(0);
    expect(getFloatPrecision(0.12345678901234567)).toEqual(17);
    expect(getFloatPrecision(-0.12345678901234567)).toEqual(17);
    expect(getFloatPrecision(0.123456789e-10)).toEqual(19);
    expect(getFloatPrecision(-0.123456789e-10)).toEqual(19);
  });
});
