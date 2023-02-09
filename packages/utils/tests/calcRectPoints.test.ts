import calcRectPoints from '@/src/calcRectPoints';

describe('calcRectPoints', () => {
  test('should points of rect is correct', () => {
    const rect0 = { x: 25, y: 25, width: 400, height: 300 };
    const points0 = {
      p1: { x: 25, y: 25 },
      p2: { x: 425, y: 25 },
      p3: { x: 425, y: 325 },
      p4: { x: 25, y: 325 },
    };
    expect(calcRectPoints(rect0)).toEqual(points0);

    const rect90 = { x: 25, y: 25, width: 400, height: 300, degrees: 90 };
    const points90 = {
      p1: { x: 75, y: 375 },
      p2: { x: 75, y: -25 },
      p3: { x: 375, y: -25 },
      p4: { x: 375, y: 375 },
    };
    expect(calcRectPoints(rect90)).toEqual(points90);

    const rect180 = { x: 25, y: 25, width: 400, height: 300, degrees: 180 };
    const points180 = {
      p1: { x: 425, y: 325 },
      p2: { x: 25, y: 325 },
      p3: { x: 25, y: 25 },
      p4: { x: 425, y: 25 },
    };
    expect(calcRectPoints(rect180)).toEqual(points180);

    const rect270 = { x: 25, y: 25, width: 400, height: 300, degrees: 270 };
    const points270 = {
      p1: { x: 375, y: -25 },
      p2: { x: 375, y: 375 },
      p3: { x: 75, y: 375 },
      p4: { x: 75, y: -25 },
    };
    expect(calcRectPoints(rect270)).toEqual(points270);
  });
});
