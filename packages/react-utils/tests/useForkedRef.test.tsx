import useForkedRef from '@/src/useForkedRef';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';

describe('useForkedRef', () => {
  test('should return same value as original ref', () => {
    const { result: originalResult } = renderHook(() => useRef<number>(1));
    const originalInstance = originalResult.current;

    const { result: forkedResult } = renderHook(() => useForkedRef(originalInstance));
    const forkedInstance = forkedResult.current;

    expect(originalInstance.current).toBe(1);
    expect(forkedInstance.current).toBe(1);
  });

  test('should update original ref object when forked ref object is updated', () => {
    const { result: originalResult } = renderHook(() => useRef<number>(1));
    const originalInstance = originalResult.current;

    const { result: forkedResult } = renderHook(() => useForkedRef(originalInstance));
    const forkedInstance = forkedResult.current;

    forkedInstance.current = 2;
    expect(originalInstance.current).toBe(2);
    expect(forkedInstance.current).toBe(2);
  });
});
