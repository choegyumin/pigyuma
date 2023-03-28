import { DependencyList, EffectCallback, useEffect } from 'react';
import usePaintEffect from './usePaintEffect';

const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : usePaintEffect;

export default function useIsomorphicPaintEffect(effect: EffectCallback, deps?: DependencyList): void {
  return useIsomorphicEffect(effect, deps);
}
