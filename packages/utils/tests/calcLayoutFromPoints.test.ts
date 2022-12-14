import calcLayoutFromPoints from '@/src/calcLayoutFromPoints';

describe('calcLayoutFromPoints', () => {
  test('should layout rect is correct', () => {
    expect(
      calcLayoutFromPoints({
        p1: { x: 0, y: 0 },
        p2: { x: 100, y: 0 },
        p3: { x: 100, y: 100 },
        p4: { x: 0, y: 100 },
      }),
    ).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  });

  test('should layout rect is correct when given points of rotated rect', () => {
    // { x: 0, y: 0, width: 100, height: 100, degrees: 45 }
    expect(
      calcLayoutFromPoints({
        p1: { x: -20.710678118654755, y: 50 },
        p2: { x: 50, y: -20.710678118654755 },
        p3: { x: 120.710678118654755, y: 50 },
        p4: { x: 50, y: 120.710678118654755 },
      }),
    ).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  });
});
