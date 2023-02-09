import mapKeys from '@/src/mapKeys';

describe('mapKeys', () => {
  test('should return new object', function () {
    const origin = {};
    const result = mapKeys(origin, (value) => value);
    expect(result).not.toBe(origin);
  });

  test('should object keys are correct', () => {
    const data = { a: 1, b: 2 };
    expect(mapKeys(data, (value, key) => `${key}_${value}`)).toEqual({ a_1: 1, b_2: 2 });
  });
});
