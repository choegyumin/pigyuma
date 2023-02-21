import nonNullable from '@/src/nonNullable';

describe('nonNullable', () => {
  test('should check if value is non nullable', function () {
    expect(nonNullable('')).toBeTruthy();
    expect(nonNullable(0)).toBeTruthy();
    expect(nonNullable(false)).toBeTruthy();
    expect(nonNullable([])).toBeTruthy();
    expect(nonNullable({})).toBeTruthy();
    expect(nonNullable({})).toBeTruthy();
    expect(nonNullable(Symbol())).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(nonNullable(function () {})).toBeTruthy();
    expect(nonNullable(null)).toBeFalsy();
    expect(nonNullable(undefined)).toBeFalsy();
  });
});
