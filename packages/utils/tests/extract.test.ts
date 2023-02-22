import extract from '@/src/extract';

describe('extract', () => {
  test('should extract input values', () => {
    expect(extract([1, 2, 3], [4, 5, 6])).toEqual([]);
    expect(extract([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
    expect(extract([1, 2, 3, 4], [2, 3])).toEqual([2, 3]);
    expect(extract([1, 2, 3, 4], [3, 2])).toEqual([2, 3]);
  });
});
