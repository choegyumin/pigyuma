import calcDegreesBetweenCoords from '@/src/calcDegreesBetweenCoords';

describe('calcDegreesBetweenCoords', () => {
  test('should degrees is correct on viewport', () => {
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(-45);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(-90);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: -1, y: 1 })).toBe(-135);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: -1, y: 0 })).toBe(180);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: -1, y: -1 })).toBe(135);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 0, y: -1 })).toBe(90);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 1, y: -1 })).toBe(45);
  });

  test('should degrees is correct on graph', () => {
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 0, y: 0 }, { graph: true })).toBe(0);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 1, y: 1 }, { graph: true })).toBe(45);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 0, y: 1 }, { graph: true })).toBe(90);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: -1, y: 1 }, { graph: true })).toBe(135);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: -1, y: 0 }, { graph: true })).toBe(180);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: -1, y: -1 }, { graph: true })).toBe(-135);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 0, y: -1 }, { graph: true })).toBe(-90);
    expect(calcDegreesBetweenCoords({ x: 0, y: 0 }, { x: 1, y: -1 }, { graph: true })).toBe(-45);
  });
});
