import setRef from '@/src/setRef';
import { renderHook } from '@testing-library/react';
import { useCallback, useRef } from 'react';

describe('setRef', () => {
  test('should change value with ref object', () => {
    const {
      result: { current: ref },
    } = renderHook(() => useRef('initial'));

    expect(ref.current).toBe('initial');

    setRef(ref, 'changed');
    expect(ref.current).toBe('changed');
  });

  test('should change value with ref callback', () => {
    const {
      result: { current: refObject },
    } = renderHook(() => useRef('initial'));
    const {
      result: { current: refCallback },
    } = renderHook(() => useCallback((value: typeof refObject['current']) => setRef(refObject, value), []));
    const {
      result: { current: refCallbackCallback },
    } = renderHook(() => useCallback((value: Parameters<typeof refCallback>[0]) => setRef(refCallback, value), []));

    expect(refObject.current).toBe('initial');

    setRef(refCallback, 'changed');
    expect(refObject.current).toBe('changed');

    setRef(refCallbackCallback, 'changed again');
    expect(refObject.current).toBe('changed again');
  });
});
