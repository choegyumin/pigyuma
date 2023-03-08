import createVarFunction from '@/src/createVarFunction';

describe('createVarFunction', () => {
  test('should create var function', () => {
    expect(createVarFunction('name')).toBe('var(--name)');
  });
});
