import toRadians from '@/src/toRadians';

describe('toRadians', () => {
  test('should radians is correct', () => {
    expect(toRadians(45)).toBe(0.7853981633974483);
    expect(toRadians(90)).toBe(1.5707963267948966);
    expect(toRadians(180)).toBe(3.141592653589793);
    expect(toRadians(360)).toBe(6.283185307179586);
  });
});
