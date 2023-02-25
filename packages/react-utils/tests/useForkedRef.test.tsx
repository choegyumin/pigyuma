import useForkedRef from '@/src/useForkedRef';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';

describe('useForkedRef', () => {
  test('should return same value as original ref', () => {
    const { result: originalResult } = renderHook(() => useRef<number>(1));
    const originalRef = originalResult.current;

    const { result: forkedResult } = renderHook(() => useForkedRef(originalRef));
    const forkedRef = forkedResult.current;

    expect(originalRef.current).toBe(1);
    expect(forkedRef.current).toBe(1);
  });

  test('should update original ref object when forked ref object is updated', () => {
    const { result: originalResult } = renderHook(() => useRef<number>(1));
    const originalRef = originalResult.current;

    const { result: forkedResult } = renderHook(() => useForkedRef(originalRef));
    const forkedRef = forkedResult.current;

    forkedRef.current = 2;
    expect(originalRef.current).toBe(2);
    expect(forkedRef.current).toBe(2);
  });
});
