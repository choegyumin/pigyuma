import useEvent from '@/src/useEvent';
import { renderHook } from '@testing-library/react';

describe('useEvent', () => {
  test('should initialize callback function', () => {
    const { result } = renderHook(() => useEvent(() => 'return'));

    expect(result.current()).toBe('return');
  });

  test('should callback function is immutable, but return changed value by new callback function', () => {
    const initialProps = { callback: () => 'initial' };
    const { rerender, result } = renderHook(({ callback }) => useEvent(callback), { initialProps });
    const prevCallback = result.current;

    rerender({ callback: () => 'changed' });
    const nextCallback = result.current;

    expect(result.current()).toBe('changed');
    expect(nextCallback).toBe(prevCallback);
  });
});
