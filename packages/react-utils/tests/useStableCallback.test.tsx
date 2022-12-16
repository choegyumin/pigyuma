import useStableCallback from '@/src/useStableCallback';
import { renderHook } from '@testing-library/react';

describe('useStableCallback', () => {
  test('should use stable callback', () => {
    const { result } = renderHook(() => useStableCallback(() => 'return'));

    expect(result.current()).toBe('return');
  });

  test('should change function by updated new callback', () => {
    const initialProps = { callback: () => 'initial' };
    const { rerender, result } = renderHook(({ callback }) => useStableCallback(callback), { initialProps });

    rerender({ callback: () => 'changed' });

    expect(result.current()).toBe('changed');
  });
});
