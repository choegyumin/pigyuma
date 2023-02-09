import mapEntries from '@/src/mapEntries';

describe('mapEntries', () => {
  test('should return new object', function () {
    const origin = {};
    const result = mapEntries(origin, (value, key) => [key, value]);
    expect(result).not.toBe(origin);
  });

  test('should object is correct', () => {
    const data = {
      a: { user: 'fred', age: 40 },
      b: { user: 'pebbles', age: 1 },
    };
    expect(mapEntries(data, (value, key) => [`${key}_${value.user}`, value.age])).toEqual({ a_fred: 40, b_pebbles: 1 });
  });
});
