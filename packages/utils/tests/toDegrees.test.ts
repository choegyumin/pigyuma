import toDegrees from '@/src/toDegrees';

describe('toDegrees', () => {
  test('should degrees is correct', () => {
    expect(toDegrees(0.7853981633974483)).toBe(45);
    expect(toDegrees(1.5707963267948966)).toBe(90);
    expect(toDegrees(3.141592653589793)).toBe(180);
    expect(toDegrees(6.283185307179586)).toBe(360);
  });
});
