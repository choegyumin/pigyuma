import { DependencyList, EffectCallback, useEffect } from 'react';

export default function useWatch(effect: EffectCallback, deps?: DependencyList): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, deps);
}
