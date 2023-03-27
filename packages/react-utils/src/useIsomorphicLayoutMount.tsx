import { EffectCallback } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export default function useIsomorphicLayoutMount(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useIsomorphicLayoutEffect(effect, []);
}
