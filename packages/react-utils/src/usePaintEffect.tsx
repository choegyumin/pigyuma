import { DependencyList, EffectCallback, useEffect } from 'react';
import waitAsyncPaint from './waitAsyncPaint';

/** @see {@link https://github.com/facebook/react/issues/20863} */
export default function usePaintEffect(effect: EffectCallback, deps?: DependencyList): void {
  return useEffect(() => {
    waitAsyncPaint().then(() => {
      effect();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
