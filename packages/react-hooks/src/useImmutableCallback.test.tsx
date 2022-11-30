import { renderHook } from '@testing-library/react';
import useImmutableCallback from './useImmutableCallback';

describe('useImmutableCallback', () => {
  test('should use immutable callback', () => {
    const { result } = renderHook(() => useImmutableCallback(() => 'return'));

    expect(result.current()).toBe('return');
  });

  test('should not change function by updated new callback', () => {
    const initialProps = { callback: () => 'initial' };
    const { rerender, result } = renderHook(({ callback }) => useImmutableCallback(callback), { initialProps });

    rerender({ callback: () => 'changed' });

    expect(result.current()).toBe('initial');
  });
});
