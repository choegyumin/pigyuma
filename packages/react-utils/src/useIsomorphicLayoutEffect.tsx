import { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react';

const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList): void {
  return useIsomorphicEffect(effect, deps);
}
