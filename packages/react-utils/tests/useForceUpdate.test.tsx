import useForceUpdate from '@/src/useForceUpdate';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

describe('useForceUpdate', () => {
  test('should force rerender component', () => {
    const spy = vi.fn();

    const { result } = renderHook(() => {
      spy();
      return useForceUpdate();
    });
    const forceUpdate = result.current;

    expect(spy).toHaveBeenCalledTimes(1);

    act(forceUpdate);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
