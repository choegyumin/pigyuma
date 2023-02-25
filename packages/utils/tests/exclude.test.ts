import exclude from '@/src/exclude';

describe('exclude', () => {
  test('should exclude input values', () => {
    expect(exclude([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
    expect(exclude([1, 2, 3], [1, 2, 3])).toEqual([]);
  });
});
