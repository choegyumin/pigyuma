import createVarName from '@/src/createVarName';

describe('createVarName', () => {
  test('should create var name', () => {
    expect(createVarName('name')).toBe('--name');
  });
});
