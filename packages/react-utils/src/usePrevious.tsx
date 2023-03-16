import { useEffect, useRef } from 'react';
import setRef from './setRef';

export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    setRef(ref, value);
  }, [value]);

  return ref.current;
}
