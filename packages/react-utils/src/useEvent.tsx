import ReactTypes from '@pigyuma/react-utility-types';
import { useInsertionEffect, useRef } from 'react';
import setRef from './setRef';
import useImmutableCallback from './useImmutableCallback';

/**
 * A Hook to define an event handler with an always-stable function identity.
 * See {@link https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md}
 */
export default function useEvent<T extends (...args: any[]) => void>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  // 이벤트 핸들러는 SSR을 고려할 필요가 없고,
  // `useLayoutEffect` 보다 더 빠른 시점에 실행하기 위해 스타일과 무관하지만 `useInsertionEffect` 를 사용
  useInsertionEffect(() => {
    setRef(callbackRef, callback);
  });
  const callbackFunction = ((...args: any[]) => callbackRef.current(...args)) as ReactTypes.CallbackFunction as T;
  return useImmutableCallback<T>(callbackFunction);
}
