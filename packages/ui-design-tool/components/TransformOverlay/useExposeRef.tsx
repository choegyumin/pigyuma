import { useStableCallback } from '@pigyuma/react-utils';
import { useImperativeHandle } from 'react';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseExposeRefDependencys = {
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useExposeRef(deps: UseExposeRefDependencys) {
  const {
    ref,
    data: { selectedLayerRef },
    uiController: { hideUI, setOverlayShapeStyle, showUI, switchIdleUI, switchSelectedUI, transformLayer },
  } = deps;

  const select = useStableCallback((layer: HTMLElement) => {
    selectedLayerRef.current = layer;
    setOverlayShapeStyle(layer);
    switchSelectedUI();
    showUI();
  });

  const deselect = useStableCallback(() => {
    selectedLayerRef.current = null;
    setOverlayShapeStyle(null);
    switchIdleUI();
    hideUI();
  });

  const transform = useStableCallback(
    (
      layer: HTMLElement,
      style: { x?: string | null; y?: string | null; width?: string | null; height?: string | null; degrees?: string | null },
    ) => {
      transformLayer(layer, style);
    },
  );

  useImperativeHandle(ref, () => ({ select, deselect, transform }), [select, deselect, transform]);
}
