import usePrevious from '@/src/usePrevious';
import { renderHook } from '@testing-library/react';

describe('usePrevious', () => {
  test('should return undefined for the first render', () => {
    const { result } = renderHook(() => usePrevious('foo'));
    expect(result.current).toBeUndefined();
  });

  test('should return the previous value after a re-render', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'foo' },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 'bar' });
    expect(result.current).toEqual('foo');

    rerender({ value: 'baz' });
    expect(result.current).toEqual('bar');
  });
});
