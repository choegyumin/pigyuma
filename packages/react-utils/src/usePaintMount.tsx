import { EffectCallback } from 'react';
import usePaintEffect from './usePaintEffect';

export default function usePaintMount(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return usePaintEffect(effect, []);
}
