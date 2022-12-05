import { useInsertionEffect, useRef } from 'react';
import ReactTypes from '@pigyuma/react-utility-types';
import useImmutableCallback from './useImmutableCallback';

export default function useStableCallback<T extends ReactTypes.CallbackFunction>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  useInsertionEffect(() => {
    callbackRef.current = callback;
  });
  const callbackFunction = ((...args: any[]) => callbackRef.current(...args)) as ReactTypes.CallbackFunction as T;
  return useImmutableCallback<T>(callbackFunction);
}
