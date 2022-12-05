import { renderHook } from '@testing-library/react';
import useEvent from './useEvent';

describe('useEvent', () => {
  test('should use event callback', () => {
    const { result } = renderHook(() => useEvent(() => 'return'));

    expect(result.current()).toBe('return');
  });

  test('should change function by updated new callback', () => {
    const initialProps = { callback: () => 'initial' };
    const { rerender, result } = renderHook(({ callback }) => useEvent(callback), { initialProps });

    rerender({ callback: () => 'changed' });

    expect(result.current()).toBe('changed');
  });
});
