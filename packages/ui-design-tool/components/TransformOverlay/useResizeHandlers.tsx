import { UIRecordQuad, UIRecordLayoutRect } from '@/types/Shape';
import { useEvent } from '@pigyuma/react-utils';
import { calcCoordByDistance, calcDistancePointFromLine } from '@pigyuma/utils';
import { useCallback } from 'react';
import { ResizingHandleTarget, TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseResizeHandlersDependencys = {
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useResizeHandlers(deps: UseResizeHandlersDependencys) {
  const {
    props: { onTransformStart, onTransformEnd, onResizeStart, onResizeEnd, onResize },
    data: {
      selectedLayerRef,
      transformTextRef,
      overlayStateRef,
      transformInitialStyleRef,
      transformInitialRectRef,
      resizingHandleTargetRef,
    },
    uiController: { getLayerShapeStyle, switchSelectedUI, switchTransformUI, transformLayer },
  } = deps;

  const changeSizeText = useCallback(
    (size: { width: string; height: string } | null) => {
      if (transformTextRef.current) {
        transformTextRef.current.textContent = size != null ? `${size.width} × ${size.height}` : '';
      }
    },
    [transformTextRef],
  );

  const onResizeHandleMouseDown = useEvent((event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof HTMLElement) || event.target.dataset.uiHandleTarget == null) {
      return;
    }
    const handleTarget = event.target.dataset.uiHandleTarget as ResizingHandleTarget;

    const layer = document.querySelector<HTMLElement>(`[data-ui-key="${selectedLayerRef.current?.dataset.uiKey}"]`);
    if (layer == null) {
      return;
    }

    const styleValues = getLayerShapeStyle(layer);

    switchTransformUI();
    overlayStateRef.current = 'resizing';
    transformInitialStyleRef.current = { ...styleValues };
    transformInitialRectRef.current = UIRecordLayoutRect.fromElement(layer);
    resizingHandleTargetRef.current = handleTarget;

    const { degrees: _degreesStyleValue, ...resizingStyleValues } = styleValues;
    changeSizeText(styleValues);
    onTransformStart?.({ target: layer });
    onResizeStart?.({ target: layer, ...resizingStyleValues });
  });

  const onMouseUpForResize = useEvent(() => {
    if (overlayStateRef.current !== 'resizing') {
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
    resizingHandleTargetRef.current = undefined;

    const { degrees: _degreesStyleValue, ...resizingStyleValues } = styleValues;
    changeSizeText(null);
    onTransformEnd?.({ target: layer });
    onResizeEnd?.({ target: layer, ...resizingStyleValues });
  });

  const onMouseMoveForResize = useEvent((event: MouseEvent) => {
    if (overlayStateRef.current !== 'resizing') {
      return;
    }

    const layer = document.querySelector<HTMLElement>(`[data-ui-key="${selectedLayerRef.current?.dataset.uiKey}"]`);
    if (layer == null) {
      return;
    }

    const cursor = {
      x: event.clientX,
      y: event.clientY,
    };

    const rect = transformInitialRectRef.current ?? UIRecordLayoutRect.fromElement(layer);
    const quad = UIRecordQuad.fromRect(rect);
    transformInitialRectRef.current = rect;

    const newQuadPoints = quad.toJSON();

    /** @todo calcDistancePointFromLines는 절댓값만 반환해야 하므로, 음수 좌표를 대체할 수 있는 로직 작성 */
    const left = (flip = false) => {
      const distance = -calcDistancePointFromLine([newQuadPoints.p1, newQuadPoints.p4], cursor);
      newQuadPoints.p1 = calcCoordByDistance(newQuadPoints.p1, rect.degrees + 180, flip ? -distance : distance);
      newQuadPoints.p4 = calcCoordByDistance(newQuadPoints.p4, rect.degrees + 180, flip ? -distance : distance);
      return rect.width + distance < 0;
    };
    const top = () => {
      const distance = calcDistancePointFromLine([newQuadPoints.p1, newQuadPoints.p2], cursor);
      newQuadPoints.p1 = calcCoordByDistance(newQuadPoints.p1, rect.degrees + 90, distance);
      newQuadPoints.p2 = calcCoordByDistance(newQuadPoints.p2, rect.degrees + 90, distance);
      return rect.height + distance < 0;
    };
    const right = (flip = false) => {
      const distance = calcDistancePointFromLine([newQuadPoints.p2, newQuadPoints.p3], cursor);
      newQuadPoints.p2 = calcCoordByDistance(newQuadPoints.p2, rect.degrees + 0, flip ? -distance : distance);
      newQuadPoints.p3 = calcCoordByDistance(newQuadPoints.p3, rect.degrees + 0, flip ? -distance : distance);
      return rect.width + distance < 0;
    };
    const bottom = () => {
      const distance = -calcDistancePointFromLine([newQuadPoints.p4, newQuadPoints.p3], cursor);
      newQuadPoints.p3 = calcCoordByDistance(newQuadPoints.p3, rect.degrees + 270, distance);
      newQuadPoints.p4 = calcCoordByDistance(newQuadPoints.p4, rect.degrees + 270, distance);
      return rect.height + distance < 0;
    };

    switch (resizingHandleTargetRef.current) {
      // prettier-ignore
      case ResizingHandleTarget.top: { top(); break; }
      // prettier-ignore
      case ResizingHandleTarget.left: { left(); break; }
      // prettier-ignore
      case ResizingHandleTarget.right: { right(); break; }
      // prettier-ignore
      case ResizingHandleTarget.bottom: { bottom(); break; }
      // prettier-ignore
      case ResizingHandleTarget.topLeft: { left(top()); break; }
      // prettier-ignore
      case ResizingHandleTarget.topRight: { right(top()); break; }
      // prettier-ignore
      case ResizingHandleTarget.bottomLeft: { left(bottom()); break; }
      // prettier-ignore
      case ResizingHandleTarget.bottomRight: { right(bottom()); break; }
    }

    const newRect = UIRecordQuad.fromQuad(newQuadPoints).getLayout();
    const styleValues = getLayerShapeStyle(layer);
    const xStyleValue = parseFloat(transformInitialStyleRef.current?.x || '0');
    const yStyleValue = parseFloat(transformInitialStyleRef.current?.y || '0');

    styleValues.x = `${Math.round(xStyleValue - rect.x + newRect.x)}px`;
    styleValues.y = `${Math.round(yStyleValue - rect.y + newRect.y)}px`;
    styleValues.width = `${Math.round(newRect.width)}px`;
    styleValues.height = `${Math.round(newRect.height)}px`;

    const { degrees: _degreesStyleValue, ...resizingStyleValues } = styleValues;
    transformLayer(layer, styleValues);
    changeSizeText(styleValues);
    onResize?.({ target: layer, ...resizingStyleValues });
  });

  return {
    onResizeHandleMouseDown,
    onMouseUpForResize,
    onMouseMoveForResize,
  };
}

export type UseResizeHandlersType = ReturnType<typeof useResizeHandlers>;
