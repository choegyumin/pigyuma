import { useEvent } from '@pigyuma/react-utils';
import { HoveringOverlayProps, HoveringOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseHandlersDependencys = {
  props: HoveringOverlayProps;
  ref: React.ForwardedRef<HoveringOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    props: { onChange },
    data: { hoveredLayerRef },
    uiController: { setOverlayShapeStyle },
  } = deps;

  const onMouseMoveForHovering = useEvent((event: MouseEvent) => {
    const { clientX, clientY } = event;

    const layer =
      document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('[data-ui-name="shape-layer"], [data-ui-name="text-layer"]') ??
      null;
    const layerKey = layer?.dataset.uiKey;

    if (layerKey === hoveredLayerRef.current?.dataset.uiKey) {
      return;
    }

    hoveredLayerRef.current = layer;
    setOverlayShapeStyle(layer);
    onChange?.({ target: layer });
  });

  return {
    onMouseMoveForHovering,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
