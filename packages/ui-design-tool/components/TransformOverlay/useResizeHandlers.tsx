import { UIRecordQuad, UIRecordRect } from '@/types/Shape';
import { useEvent } from '@pigyuma/react-utils';
import { calcDistancePointFromLine } from '@pigyuma/utils';
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
    transformInitialRectRef.current = UIRecordRect.fromElement(layer);
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

    const rect = transformInitialRectRef.current ?? UIRecordRect.fromElement(layer);
    const quad = UIRecordQuad.fromRect(rect);
    transformInitialRectRef.current = rect;

    const boundingRect = UIRecordQuad.fromRect({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      degrees: rect.degrees,
    }).getBounds();

    const styleValues = getLayerShapeStyle(layer);
    const xStyleValue = parseFloat(transformInitialStyleRef.current?.x || '0');
    const yStyleValue = parseFloat(transformInitialStyleRef.current?.y || '0');

    const left = () => {
      const distance = calcDistancePointFromLine([quad.p1, quad.p4], cursor);
      const size = rect.width + distance;
      const flip = size < 0;
      styleValues.width = `${Math.round(Math.abs(size))}px`;
      if (flip) {
        styleValues.x = `${Math.round(xStyleValue + rect.width)}px`;
      } else {
        styleValues.x = `${Math.round(xStyleValue - distance)}px`;
      }
    };
    const top = () => {
      const distance = -calcDistancePointFromLine([quad.p1, quad.p2], cursor);
      const size = rect.height + distance;
      const flip = size < 0;
      styleValues.height = `${Math.round(Math.abs(size))}px`;
      if (flip) {
        styleValues.y = `${Math.round(yStyleValue + rect.height)}px`;
      } else {
        styleValues.y = `${Math.round(yStyleValue - distance)}px`;
      }
    };
    const right = () => {
      const distance = -calcDistancePointFromLine([quad.p2, quad.p3], cursor);
      const size = rect.width + distance;
      const flip = size < 0;
      const zeroBounds = UIRecordQuad.fromRect({ ...rect.toJSON(), width: 0 }).getBounds();
      const transformedBounds = UIRecordQuad.fromRect({ ...rect.toJSON(), width: Math.abs(size) }).getBounds();
      const movement = {
        x: boundingRect.x - transformedBounds.x,
        y: boundingRect.y - transformedBounds.y,
      };
      if (flip) {
        movement.x = -movement.x + (boundingRect.x - zeroBounds.x) * 2 + size;
        movement.y = -movement.y + (boundingRect.y - zeroBounds.y) * 2;
      }
      if (0 < rect.degrees && rect.degrees < 180) {
        movement.y = -movement.y;
      }
      if (90 < rect.degrees && rect.degrees < 270) {
        movement.x = boundingRect.width - transformedBounds.width - (transformedBounds.x - boundingRect.x);
        if (flip) {
          const asdf = boundingRect.width - zeroBounds.width - (zeroBounds.x - boundingRect.x);
          movement.x = asdf - (transformedBounds.x - zeroBounds.x);
        }
      }
      styleValues.x = `${Math.round(xStyleValue + movement.x)}px`;
      styleValues.y = `${Math.round(yStyleValue + movement.y)}px`;
      styleValues.width = `${Math.round(Math.abs(size))}px`;
    };
    const bottom = () => {
      const distance = -calcDistancePointFromLine([quad.p3, quad.p4], cursor);
      const size = rect.height + distance;
      const flip = size < 0;
      styleValues.height = `${Math.round(Math.abs(size))}px`;
      if (flip) {
        styleValues.y = `${Math.round(yStyleValue + size)}px`;
      }
    };
    if (resizingHandleTargetRef.current === ResizingHandleTarget.top) {
      top();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.left) {
      left();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.right) {
      right();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.bottom) {
      bottom();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.topLeft) {
      top();
      left();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.topRight) {
      top();
      right();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.bottomLeft) {
      bottom();
      left();
    }
    if (resizingHandleTargetRef.current === ResizingHandleTarget.bottomRight) {
      bottom();
      right();
    }

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
