import useCloneDeepState from '@/src/useCloneDeepState';
import { act, renderHook } from '@testing-library/react';

describe('useCloneDeepState', () => {
  test('should initialize state with given value', () => {
    const initialState = [{ name: 'foo' }, { name: 'bar' }];
    const { result } = renderHook(() => useCloneDeepState(initialState));
    const [state] = result.current;

    expect(state).toEqual(initialState);
    expect(state).not.toBe(initialState);
    expect(state[0]).toEqual(initialState[0]);
    expect(state[0]).not.toBe(initialState[0]);
  });

  test('should update state with given value', () => {
    const initialState = [{ name: 'foo' }, { name: 'bar' }];
    const { result } = renderHook(() => useCloneDeepState(initialState));
    let [state, setState] = result.current;

    const nextState = [{ name: 'baz' }];
    act(() => setState(nextState));
    [state, setState] = result.current;

    expect(state).toEqual(nextState);
    expect(state).not.toBe(nextState);
    expect(state[0]).toEqual(nextState[0]);
    expect(state[0]).not.toBe(nextState[0]);
  });
});
