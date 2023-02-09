import calcBoundsFromLayout from '@/src/calcBoundsFromLayout';

describe('calcBoundsFromLayout', () => {
  test('should bounding rect is correct', () => {
    const layout = { x: 0, y: 0, width: 100, height: 100 };
    const bounds = { x: 0, y: 0, width: 100, height: 100 };
    expect(calcBoundsFromLayout(layout)).toEqual(bounds);
  });

  test('should bounding rect is correct when given degrees', () => {
    const layout = { x: 0, y: 0, width: 100, height: 100, degrees: 45 };
    const bounds = { x: -20.71067811865476, y: -20.71067811865476, width: 141.4213562373095, height: 141.4213562373095 };
    expect(calcBoundsFromLayout(layout)).toEqual(bounds);
  });
});
