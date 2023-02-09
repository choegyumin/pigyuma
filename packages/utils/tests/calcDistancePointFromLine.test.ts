import calcDistancePointFromLine from '@/src/calcDistancePointFromLine';

describe('calcDistancePointFromLine', () => {
  test('should distance is correct', () => {
    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
        ],
        { x: 50, y: 0 },
      ),
    ).toEqual(0);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
        ],
        { x: 50, y: 50 },
      ),
    ).toEqual(50);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
        ],
        { x: 50, y: -50 },
      ),
    ).toEqual(50);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 0, y: 100 },
        ],
        { x: 0, y: 50 },
      ),
    ).toEqual(0);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 0, y: 100 },
        ],
        { x: -50, y: 50 },
      ),
    ).toEqual(50);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 0, y: 100 },
        ],
        { x: 50, y: 50 },
      ),
    ).toEqual(50);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
        ],
        { x: 25, y: 75 },
      ),
    ).toEqual(35.35533905932738);

    expect(
      calcDistancePointFromLine(
        [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
        ],
        { x: 75, y: 25 },
      ),
    ).toEqual(35.35533905932738);
  });
});
