import calcDistancePointFromPoint from '@/src/calcDistancePointFromPoint';

describe('calcDistancePointFromPoint', () => {
  test('should distance is correct', () => {
    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual(0);

    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: 1, y: 0 })).toEqual(1);
    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: -1, y: 0 })).toEqual(1);

    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: 0, y: -1 })).toEqual(1);
    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: 0, y: 1 })).toEqual(1);

    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: 1, y: 1 })).toEqual(1.4142135623730951);
    expect(calcDistancePointFromPoint({ x: 0, y: 0 }, { x: -1, y: -1 })).toEqual(1.4142135623730951);
  });
});
