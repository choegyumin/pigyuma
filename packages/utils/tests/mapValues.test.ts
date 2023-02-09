import mapValues from '@/src/mapValues';

describe('mapValues', () => {
  test('should return new object', function () {
    const origin = {};
    const result = mapValues(origin, (value) => value);
    expect(result).not.toBe(origin);
  });

  test('should object values are correct', () => {
    const data = {
      fred: { user: 'fred', age: 40 },
      pebbles: { user: 'pebbles', age: 1 },
    };
    expect(mapValues(data, (value) => value.age)).toEqual({ fred: 40, pebbles: 1 });
  });
});
