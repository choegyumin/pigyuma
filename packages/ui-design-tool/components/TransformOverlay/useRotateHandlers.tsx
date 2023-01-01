import { UIRecordLayoutRect } from '@/types/Shape';
import { useEvent } from '@pigyuma/react-utils';
import { calcDegreesBetweenCoords, toDegrees360 } from '@pigyuma/utils';
import { useCallback } from 'react';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseRotateHandlersDependencys = {
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useRotateHandlers(deps: UseRotateHandlersDependencys) {
  const {
    props: { onTransformStart, onTransformEnd, onRotateStart, onRotateEnd, onRotate },
    data: {
      selectedLayerRef,
      transformTextRef,
      overlayStateRef,
      transformInitialStyleRef,
      transformInitialRectRef,
      rotatingHandleCoordDegreesRef,
      rotatingLayerInitialDegreesRef,
    },
    uiController: { getLayerShapeStyle, switchSelectedUI, switchTransformUI, transformLayer },
  } = deps;

  const changeDegreesText = useCallback(
    (degrees: number | null) => {
      if (transformTextRef.current) {
        transformTextRef.current.textContent = degrees != null ? `${toDegrees360(degrees)}°` : '';
      }
    },
    [transformTextRef],
  );

  const onRotateHandleMouseDown = useEvent((event: React.MouseEvent<HTMLElement>) => {
    const layer = document.querySelector<HTMLElement>(`[data-ui-key="${selectedLayerRef.current?.dataset.uiKey}"]`);
    if (layer == null) {
      return;
    }

    const rect = transformInitialRectRef.current ?? UIRecordLayoutRect.fromElement(layer);
    const { clientX, clientY } = event;

    const styleValues = getLayerShapeStyle(layer);

    switchTransformUI();
    overlayStateRef.current = 'rotating';
    transformInitialStyleRef.current = { ...styleValues };
    transformInitialRectRef.current = rect;
    rotatingHandleCoordDegreesRef.current = calcDegreesBetweenCoords(
      { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
      { x: clientX, y: clientY },
    );
    rotatingLayerInitialDegreesRef.current = rect.degrees;

    const rotatingStyleValues = { degrees: styleValues.degrees };
    changeDegreesText(rotatingLayerInitialDegreesRef.current);
    onTransformStart?.({ target: layer });
    onRotateStart?.({ target: layer, ...rotatingStyleValues });
  });

  const onMouseUpForRotate = useEvent(() => {
    if (overlayStateRef.current !== 'rotating') {
      return;
    }

    const layer = document.querySelector<HTMLElement>(`[data-ui-key="${selectedLayerRef.current?.dataset.uiKey}"]`);
    if (layer == null) {
      return;
    }

    const styleValues = getLayerShapeStyle(layer);

    if (transformInitialStyleRef.current) {
      transformLayer(layer, transformInitialStyleRef.current ?? {});
    }
    switchSelectedUI();
    overlayStateRef.current = 'idle';
    transformInitialStyleRef.current = undefined;
    transformInitialRectRef.current = undefined;
    rotatingHandleCoordDegreesRef.current = undefined;
    rotatingLayerInitialDegreesRef.current = undefined;

    const rotatingStyleValues = { degrees: styleValues.degrees };
    changeDegreesText(null);
    onTransformEnd?.({ target: layer });
    onRotateEnd?.({ target: layer, ...rotatingStyleValues });
  });

  const onMouseMoveForRotate = useEvent((event: MouseEvent) => {
    if (overlayStateRef.current !== 'rotating') {
      return;
    }

    const layer = document.querySelector<HTMLElement>(`[data-ui-key="${selectedLayerRef.current?.dataset.uiKey}"]`);
    if (layer == null) {
      return;
    }

    const rect = transformInitialRectRef.current ?? UIRecordLayoutRect.fromElement(layer);
    transformInitialRectRef.current = rect;
    const { clientX, clientY } = event;

    let degrees = calcDegreesBetweenCoords(
      {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      },
      {
        x: clientX,
        y: clientY,
      },
    );
    degrees -= rotatingHandleCoordDegreesRef.current ?? 0;
    degrees += rotatingLayerInitialDegreesRef.current ?? 0;
    degrees = Math.round(degrees);
    const cssDegrees = toDegrees360(degrees);
    const styleValues = { degrees: `${cssDegrees}deg` };

    transformLayer(layer, styleValues);
    changeDegreesText(degrees);
    onRotate?.({ target: layer, ...styleValues });
  });

  return {
    onRotateHandleMouseDown,
    onMouseUpForRotate,
    onMouseMoveForRotate,
  };
}

export type UseRotateHandlersType = ReturnType<typeof useRotateHandlers>;
