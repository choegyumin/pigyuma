import styleAreEqual from '@/src/styleAreEqual';

describe('styleAreEqual', () => {
  test('should compare styles', () => {
    expect(styleAreEqual({}, {})).toEqual(true);
    expect(styleAreEqual({}, { color: 'red' })).toEqual(false);

    expect(
      styleAreEqual(
        {
          color: 'white',
          background: 'black',
        },
        {
          color: 'white',
          background: 'black',
        },
      ),
    ).toEqual(true);

    expect(
      styleAreEqual(
        {
          color: 'white',
          background: 'black',
        },
        {
          color: 'red',
        },
      ),
    ).toEqual(false);
  });
});
