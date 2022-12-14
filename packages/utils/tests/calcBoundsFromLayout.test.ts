import calcBoundsFromLayout from '@/src/calcBoundsFromLayout';

describe('calcBoundsFromLayout', () => {
  test('should bounding rect is correct', () => {
    expect(
      calcBoundsFromLayout({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }),
    ).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  });

  test('should bounding rect is correct when given degrees', () => {
    expect(
      calcBoundsFromLayout({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        degrees: 45,
      }),
    ).toEqual({
      x: -20.710678118654755,
      y: -20.710678118654755,
      width: 141.4213562373095,
      height: 141.4213562373095,
    });
  });
});
