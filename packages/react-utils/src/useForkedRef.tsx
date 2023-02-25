import { ForwardedRef, MutableRefObject, RefCallback, RefObject, useRef, useState } from 'react';
import setRef from './setRef';

function useForkedRef<T>(ref: MutableRefObject<T>): MutableRefObject<T>;
function useForkedRef<T>(ref: RefObject<T>): RefObject<T>;
function useForkedRef<T>(ref: RefCallback<T>): MutableRefObject<T>;
function useForkedRef<T>(ref: ForwardedRef<T>): MutableRefObject<T | null>;
function useForkedRef<T>(ref?: MutableRefObject<T | null | undefined> | RefCallback<T> | null) {
  const isRefObject = ref != null && typeof ref === 'object';

  const forked = useRef<T | undefined>(isRefObject ? ref.current : undefined);
  if (isRefObject) {
    setRef(ref, forked.current);
  }

  const [proxy] = useState<typeof ref>(() => ({
    get current() {
      return forked.current;
    },
    set current(value) {
      if (ref) {
        setRef(ref, value);
      }
      setRef(forked, value);
    },
  }));

  return proxy;
}

export default useForkedRef;
