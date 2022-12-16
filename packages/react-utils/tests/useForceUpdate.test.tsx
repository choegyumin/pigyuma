import useForceUpdate from '@/src/useForceUpdate';
import { act, renderHook } from '@testing-library/react';

describe('useForceUpdate', () => {
  test('should force rerender component', () => {
    let count = 0;

    const { result } = renderHook(() => {
      count++;
      return useForceUpdate();
    });

    expect(count).toEqual(1);

    act(result.current);
    expect(count).toEqual(2);
  });
});
