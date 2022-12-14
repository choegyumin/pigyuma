import convertCSSDegrees from '@/src/convertCSSDegrees';

describe('convertCSSDegrees', () => {
  test('should degrees is correct converted between Math and CSS', () => {
    const degrees = {
      '0': 0,
      '45': 45,
      '90': 90,
      '180': 180,
      '270': 270,
      '315': 315,
      '360': 360,
    };

    const cssDegrees = {
      '0': 90,
      '45': 45,
      '90': 0,
      '180': -90,
      '270': -180,
      '315': -225,
      '360': -270,
    };

    expect(convertCSSDegrees(degrees['0'])).toBe(cssDegrees['0']);
    expect(convertCSSDegrees(degrees['45'])).toBe(cssDegrees['45']);
    expect(convertCSSDegrees(degrees['90'])).toBe(cssDegrees['90']);
    expect(convertCSSDegrees(degrees['180'])).toBe(cssDegrees['180']);
    expect(convertCSSDegrees(degrees['270'])).toBe(cssDegrees['270']);
    expect(convertCSSDegrees(degrees['315'])).toBe(cssDegrees['315']);
    expect(convertCSSDegrees(degrees['360'])).toBe(cssDegrees['360']);

    expect(convertCSSDegrees(cssDegrees['0'])).toBe(degrees['0']);
    expect(convertCSSDegrees(cssDegrees['45'])).toBe(degrees['45']);
    expect(convertCSSDegrees(cssDegrees['90'])).toBe(degrees['90']);
    expect(convertCSSDegrees(cssDegrees['180'])).toBe(degrees['180']);
    expect(convertCSSDegrees(cssDegrees['270'])).toBe(degrees['270']);
    expect(convertCSSDegrees(cssDegrees['315'])).toBe(degrees['315']);
    expect(convertCSSDegrees(cssDegrees['360'])).toBe(degrees['360']);
  });
});
