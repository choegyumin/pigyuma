import useStableCallback from '@/src/useStableCallback';
import { renderHook } from '@testing-library/react';

describe('useStableCallback', () => {
  test('should initialize callback function', () => {
    const { result } = renderHook(() => useStableCallback(() => 'return'));

    expect(result.current()).toBe('return');
  });

  test('should callback function is immutable, but return changed value by new callback function', () => {
    const initialProps = { callback: () => 'initial' };
    const { rerender, result } = renderHook(({ callback }) => useStableCallback(callback), { initialProps });
    const prevCallback = result.current;

    rerender({ callback: () => 'changed' });
    const nextCallback = result.current;

    expect(result.current()).toBe('changed');
    expect(nextCallback).toBe(prevCallback);
  });
});
