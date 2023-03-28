import { EffectCallback } from 'react';
import useIsomorphicPaintEffect from './useIsomorphicPaintEffect';

export default function useIsomorphicPaintMount(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useIsomorphicPaintEffect(effect, []);
}
