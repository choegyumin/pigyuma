import isVarName from '@/src/isVarName';

describe('isVarName', () => {
  test('should be true, if given CSS var name', () => {
    expect(isVarName('var(--name)')).toBeFalsy();
    expect(isVarName('--name')).toBeTruthy();
    expect(isVarName('name')).toBeFalsy();
  });
});
