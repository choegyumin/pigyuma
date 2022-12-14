import calcRectPoints from '@/src/calcRectPoints';

describe('calcRectPoints', () => {
  test('should points of rect is correct', () => {
    expect(
      calcRectPoints({
        x: 25,
        y: 25,
        width: 400,
        height: 300,
      }),
    ).toEqual({
      p1: { x: 25, y: 25 },
      p2: { x: 425, y: 25 },
      p3: { x: 425, y: 325 },
      p4: { x: 25, y: 325 },
    });
  });

  test('should points of rect is correct when given degrees', () => {
    expect(
      calcRectPoints({
        x: 25,
        y: 25,
        width: 400,
        height: 300,
        degrees: 90,
      }),
    ).toEqual({
      p1: { x: 75, y: 375 },
      p2: { x: 75, y: -25 },
      p3: { x: 375, y: -25 },
      p4: { x: 375, y: 375 },
    });
  });
});
