import useDOMStyle from '@/src/useDOMStyle';
import { render, renderHook } from '@testing-library/react';
import { useRef } from 'react';

describe('useDOMStyle', () => {
  test('should initialize React style state and function that updates it', () => {
    const { result } = renderHook(() => useDOMStyle({ color: 'white', background: 'black' }, () => []));
    const [style, setStyle] = result.current;

    expect(style).toEqual({ color: 'white', background: 'black' });
    expect(typeof setStyle).toEqual('function');
  });

  test('should change React and DOM style', () => {
    const refHook = renderHook(() => useRef<HTMLDivElement>(null));
    const ref = refHook.result.current;

    const styleHook = renderHook(() => useDOMStyle({ color: 'white', background: 'black' }, () => [ref.current]));
    const [style, setStyle] = styleHook.result.current;

    render(<div ref={refHook.result.current} style={style.freeze()} />);

    setStyle({ color: 'red' });

    expect(style).toEqual({ color: 'red', background: 'black' });
    expect(ref.current?.style.getPropertyValue('color')).toEqual('red');
  });

  test('should change React and DOM style without reconciliation', () => {
    const refHook = renderHook(() => useRef<HTMLDivElement>(null));
    const ref = refHook.result.current;

    const styleHook = renderHook(() => useDOMStyle({ color: 'white', background: 'black' }, () => [ref.current]));
    const [style, setStyle] = styleHook.result.current;

    render(<div ref={refHook.result.current} style={style.freeze()} />);

    setStyle({ color: 'red' });

    expect(style).toEqual({ color: 'red', background: 'black' });
    expect(ref.current?.style.getPropertyValue('color')).toEqual('red');
  });

  test('should return new (immutable) style object when freeze', () => {
    const { result } = renderHook(() => useDOMStyle({ color: 'white', background: 'black' }, () => []));
    const [style, setStyle] = result.current;
    const frozenStyle = style.freeze();

    setStyle({ color: 'red' });
    setStyle({ background: 'blue' });

    expect(frozenStyle).toEqual({ color: 'white', background: 'black' });
  });
});
