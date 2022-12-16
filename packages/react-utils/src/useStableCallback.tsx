import ReactTypes from '@pigyuma/react-utility-types';
import { useRef } from 'react';
import setRef from './setRef';
import useImmutableCallback from './useImmutableCallback';

/**
 * A Hook to define an callback with an always-stable function identity.
 * Unless in your special case, you probably want @see useCallback instead.
 */
export default function useStableCallback<T extends ReactTypes.CallbackFunction>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  setRef(callbackRef, callback);
  const callbackFunction = ((...args: any[]) => callbackRef.current(...args)) as ReactTypes.CallbackFunction as T;
  return useImmutableCallback<T>(callbackFunction);
}
