import useImmutableCallback from '@/src/useImmutableCallback';
import { renderHook } from '@testing-library/react';

describe('useImmutableCallback', () => {
  test('should initialize callback function', () => {
    const { result } = renderHook(() => useImmutableCallback(() => 'return'));

    expect(result.current()).toBe('return');
  });

  test('should callback function is immutable', () => {
    const initialProps = { callback: () => 'initial' };
    const { rerender, result } = renderHook(({ callback }) => useImmutableCallback(callback), { initialProps });
    const prevCallback = result.current;

    rerender({ callback: () => 'changed' });
    const nextCallback = result.current;

    expect(result.current()).toBe('initial');
    expect(nextCallback).toBe(prevCallback);
  });
});
