import calcCoordByDistance from '@/src/calcCoordByDistance';

const distance45 = 1.4142135623730951;
const distance90 = 1;

describe('calcCoordByDistance', () => {
  test('should coord is correct on viewport', () => {
    expect(calcCoordByDistance({ x: 0, y: 0 }, 0, distance90)).toEqual({ x: 1, y: 0 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 45, distance45)).toEqual({ x: 1, y: -1 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 90, distance90)).toEqual({ x: 0, y: -1 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 180, distance90)).toEqual({ x: -1, y: 0 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 270, distance90)).toEqual({ x: 0, y: 1 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 360, distance90)).toEqual({ x: 1, y: 0 });
  });

  test('should coord is correct on graph', () => {
    expect(calcCoordByDistance({ x: 0, y: 0 }, 0, distance90, { graph: true })).toEqual({ x: 1, y: 0 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 45, distance45, { graph: true })).toEqual({ x: 1, y: 1 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 90, distance90, { graph: true })).toEqual({ x: 0, y: 1 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 180, distance90, { graph: true })).toEqual({ x: -1, y: 0 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 270, distance90, { graph: true })).toEqual({ x: 0, y: -1 });
    expect(calcCoordByDistance({ x: 0, y: 0 }, 360, distance90, { graph: true })).toEqual({ x: 1, y: 0 });
  });
});
