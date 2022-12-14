import toDegrees360 from '@/src/toDegrees360';

describe('toDegrees360', () => {
  test('should degrees range from 0 to 360', () => {
    expect(toDegrees360(0)).toBe(0);
    expect(toDegrees360(45)).toBe(45);
    expect(toDegrees360(90)).toBe(90);
    expect(toDegrees360(180)).toBe(180);
    expect(toDegrees360(-180)).toBe(180);
    expect(toDegrees360(-90)).toBe(270);
    expect(toDegrees360(-45)).toBe(315);
    expect(toDegrees360(360)).toBe(0);
  });
});
