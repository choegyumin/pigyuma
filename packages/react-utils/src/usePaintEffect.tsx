import { DependencyList, EffectCallback, useEffect } from 'react';
import pushAsyncAfterRender from './pushAsyncAfterRender';

/** @see {@link https://github.com/facebook/react/issues/20863} */
export default function usePaintEffect(effect: EffectCallback, deps?: DependencyList): void {
  return useEffect(() => {
    pushAsyncAfterRender(effect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
