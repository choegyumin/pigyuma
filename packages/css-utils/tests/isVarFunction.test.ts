import isVarFunction from '@/src/isVarFunction';

describe('isVarFunction', () => {
  test('should be true, if given CSS var function', () => {
    expect(isVarFunction('var(--name)')).toBeTruthy();
    expect(isVarFunction('--name')).toBeFalsy();
    expect(isVarFunction('name')).toBeFalsy();
  });
});
