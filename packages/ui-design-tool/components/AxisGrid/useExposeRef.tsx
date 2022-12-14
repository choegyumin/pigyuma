import { useStableCallback } from '@pigyuma/react-utils';
import { useImperativeHandle } from 'react';
import { AxisGridProps, AxisGridRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseExposeRefDependencys = {
  props: AxisGridProps;
  ref: React.ForwardedRef<AxisGridRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useExposeRef(deps: UseExposeRefDependencys) {
  const {
    ref,
    uiController: { hideUI, setOverlayShapeStyle, showUI },
  } = deps;

  const select = useStableCallback((layer: HTMLElement) => {
    setOverlayShapeStyle(layer);
    showUI();
  });

  const deselect = useStableCallback(() => {
    setOverlayShapeStyle(null);
    hideUI();
  });

  useImperativeHandle(ref, () => ({ select, deselect }), [select, deselect]);
}
