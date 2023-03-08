import createVarFunction from '@/src/createVarFunction';
import createVarName from '@/src/createVarName';
import getVarNames from '@/src/getVarNames';

describe('getVarNames', () => {
  test('should return var names', () => {
    expect(
      getVarNames({
        fn: createVarFunction('fn'),
        name: createVarName('name'),
      }),
    ).toEqual({
      fn: '--fn',
      name: '--name',
    });
  });
});
