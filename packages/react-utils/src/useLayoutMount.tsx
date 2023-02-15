import { EffectCallback, useLayoutEffect } from 'react';

export default function useLayoutMount(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useLayoutEffect(effect, []);
}
