import toDegrees180 from '@/src/toDegrees180';

describe('toDegrees180', () => {
  test('should degrees range from -180 to 180', () => {
    expect(toDegrees180(0)).toBe(0);
    expect(toDegrees180(45)).toBe(45);
    expect(toDegrees180(90)).toBe(90);
    expect(toDegrees180(180)).toBe(180);
    expect(toDegrees180(270)).toBe(-90);
    expect(toDegrees180(315)).toBe(-45);
    expect(toDegrees180(360)).toBe(0);
  });
});
