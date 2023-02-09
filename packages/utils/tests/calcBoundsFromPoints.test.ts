import calcBoundsFromPoints from '@/src/calcBoundsFromPoints';

describe('calcBoundsFromPoints', () => {
  test('should bounding rect is correct', () => {
    const points = {
      p1: { x: 0, y: 0 },
      p2: { x: 100, y: 0 },
      p3: { x: 100, y: 100 },
      p4: { x: 0, y: 100 },
    };
    const bounds = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    expect(calcBoundsFromPoints(points)).toEqual(bounds);
  });

  test('should bounding rect is correct when given points of rotated rect', () => {
    const points = {
      p1: { x: -20.710678118654755, y: 50 },
      p2: { x: 50, y: -20.710678118654755 },
      p3: { x: 120.710678118654755, y: 50 },
      p4: { x: 50, y: 120.710678118654755 },
    };
    const bounds = {
      x: -20.710678118654755,
      y: -20.710678118654755,
      width: 141.4213562373095,
      height: 141.4213562373095,
    };
    expect(calcBoundsFromPoints(points)).toEqual(bounds);
  });
});
