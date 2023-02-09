import isUnitlessCSSNumber from '@/src/isUnitlessCSSNumber';

describe('isUnitlessCSSNumber', () => {
  test('should be true, if given CSS property value is unitless number', () => {
    expect(isUnitlessCSSNumber('zIndex')).toBe(true);
    expect(isUnitlessCSSNumber('width')).toBe(false);
  });
});
