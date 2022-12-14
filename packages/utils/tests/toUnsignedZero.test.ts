import toUnsignedZero from '@/src/toUnsignedZero';

describe('toUnsignedZero', () => {
  test('should convert only nagative zero to positive', () => {
    expect(toUnsignedZero(0)).toBe(0);
    expect(toUnsignedZero(-0)).toBe(0);
    expect(toUnsignedZero(1)).toBe(1);
    expect(toUnsignedZero(-1)).toBe(-1);
  });
});
