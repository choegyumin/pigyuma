import useValue from '@/src/useValue';
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';

describe('useValue', () => {
  test('should return defaultValue when initial value is undefined', () => {
    const { result } = renderHook(() => useValue(undefined, 'defaultValue'));
    const [value] = result.current;
    expect(value).toBe('defaultValue');
  });

  test('should return value when initial value is not undefined', () => {
    const { result } = renderHook(() => useValue('value', 'defaultValue'));
    const [value] = result.current;
    expect(value).toBe('value');
  });

  test('should update the value correctly when initial value is undefined', () => {
    const { result } = renderHook(() => useValue(undefined, 'defaultValue'));
    let [value, setValue] = result.current;
    expect(value).toBe('defaultValue');

    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('newValue');
  });

  test('should not update the value when initial value is not undefined', () => {
    const { result } = renderHook(() => useValue('value', 'defaultValue'));
    let [value, setValue] = result.current;
    expect(value).toBe('value');

    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('value');
  });

  test('should update the value correctly when initial value is not undefined', () => {
    const { result: stateResult } = renderHook(() => useState('value'));
    let [state, setState] = stateResult.current;

    const { result: valueResult, rerender: rerenderValue } = renderHook(({ value }) => useValue(value, 'defaultValue'), {
      initialProps: { value: state },
    });
    let [value] = valueResult.current;
    expect(value).toBe(state);

    act(() => setState('newValue'));
    [state, setState] = stateResult.current;

    rerenderValue({ value: state });
    [value] = valueResult.current;

    expect(state).toBe('newValue');
    expect(value).toBe('newValue');
  });

  test('should log an error when input changes from uncontrolled to controlled', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => 'called');

    const { result, rerender } = renderHook(({ value }) => useValue(value, 'uncontrolled'), {
      initialProps: { value: undefined as string | undefined },
    });
    let [value] = result.current;
    expect(value).toBe('uncontrolled');

    rerender({ value: 'controlled' });
    [value] = result.current;
    expect(value).toBe('controlled');

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test('should log an error when input changes from controlled to uncontrolled', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => 'called');

    const { result, rerender } = renderHook(({ value }) => useValue(value, 'uncontrolled'), {
      initialProps: { value: 'controlled' as string | undefined },
    });
    let [value] = result.current;
    expect(value).toBe('controlled');

    rerender({ value: undefined });
    [value] = result.current;
    expect(value).toBe('controlled');

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
