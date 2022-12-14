import { useStableCallback } from '@pigyuma/react-utils';
import { useImperativeHandle } from 'react';
import { HoveringOverlayProps, HoveringOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseExposeRefDependencys = {
  props: HoveringOverlayProps;
  ref: React.ForwardedRef<HoveringOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useExposeRef(deps: UseExposeRefDependencys) {
  const {
    ref,
    data: { hoveredLayerRef },
    uiController: { hideUI, setOverlayShapeStyle, showUI },
  } = deps;

  const on = useStableCallback(() => {
    setOverlayShapeStyle(hoveredLayerRef.current);
    showUI();
  });

  const off = useStableCallback(() => {
    hideUI();
  });

  useImperativeHandle(ref, () => ({ on, off }), [on, off]);
}
