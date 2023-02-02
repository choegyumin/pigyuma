import { UIRecordQuad, UIRecordQuadInit, UIRecordRect, UIRecordRectInit } from '@/types/Shape';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { calcCoordByDistance, calcDistancePointFromLine, pick } from '@pigyuma/utils';
import { useCallback } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { ResizeHandlePlacement, TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseResizeHandlersDependencys = {
  api: UIDesignToolAPI;
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useResizeHandlers(deps: UseResizeHandlersDependencys) {
  const {
    api,
    props: { onTransformStart, onTransform, onTransformEnd },
    data: { selectedRecordRef, infoTextRef, transformStatusRef, transformInitialRectRef, transformLastRectRef, resizingHandlePlacementRef },
    uiController: { switchSelectedUI, switchTransformUI },
  } = deps;

  const changeSizeText = useCallback(
    (size: { width: number; height: number } | null) => {
      if (infoTextRef.current) {
        infoTextRef.current.textContent = size != null ? `${size.width} × ${size.height}` : '';
      }
    },
    [infoTextRef],
  );

  const onResizeHandleMouseDown = useEvent((event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof HTMLElement) || event.target.dataset.handlePlacement == null) {
      return;
    }
    const handle = event.target.dataset.handlePlacement as ResizeHandlePlacement;

    const record = selectedRecordRef.current;
    const recordKey = record?.key;
    const target = api.query({ key: recordKey || '' });
    if (target == null) {
      return;
    }

    const rect = UIRecordRect.fromElement(target);

    switchTransformUI();
    setRef(transformStatusRef, 'resizing');
    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(resizingHandlePlacementRef, handle);

    changeSizeText(rect);
    onTransformStart?.({ target, record, type: 'resize', rect });
  });

  const onMouseUpForResize = useEvent(() => {
    if (transformStatusRef.current !== 'resizing') {
      return;
    }

    const record = selectedRecordRef.current;
    const recordKey = record?.key;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = api.query({ key: recordKey || '' });
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

    switchSelectedUI();
    setRef(transformStatusRef, 'idle');
    setRef(transformInitialRectRef, undefined);
    setRef(transformLastRectRef, undefined);
    setRef(resizingHandlePlacementRef, undefined);

    changeSizeText(null);
    onTransformEnd?.({ target, record, type: 'resize', rect });
  });

  const onMouseMoveForResize = useEvent((event: MouseEvent) => {
    if (transformStatusRef.current !== 'resizing') {
      return;
    }

    const record = selectedRecordRef.current;
    const recordKey = record?.key;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = api.query({ key: recordKey || '' });
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformInitialRectRef.current;
    if (rect == null) {
      throw new Error("'resize' event was not properly initialized.");
    }

    const quad = UIRecordQuad.fromRect(rect);

    const cursor = {
      x: event.clientX,
      y: event.clientY,
    };

    const newQuadInit: UIRecordQuadInit = quad.toJSON();

    const left = (flip = false) => {
      const distance = -calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p4], cursor, { abs: false });
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 180, flip ? -distance : distance);
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 180, flip ? -distance : distance);
      return rect.width + distance < 0;
    };
    const top = () => {
      const distance = calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p2], cursor, { abs: false });
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 90, distance);
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 90, distance);
      return rect.height + distance < 0;
    };
    const right = (flip = false) => {
      const distance = calcDistancePointFromLine([newQuadInit.p2, newQuadInit.p3], cursor, { abs: false });
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 0, flip ? -distance : distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 0, flip ? -distance : distance);
      return rect.width + distance < 0;
    };
    const bottom = () => {
      const distance = -calcDistancePointFromLine([newQuadInit.p4, newQuadInit.p3], cursor, { abs: false });
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 270, distance);
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 270, distance);
      return rect.height + distance < 0;
    };

    switch (resizingHandlePlacementRef.current) {
      // prettier-ignore
      case ResizeHandlePlacement.top: { top(); break; }
      // prettier-ignore
      case ResizeHandlePlacement.left: { left(); break; }
      // prettier-ignore
      case ResizeHandlePlacement.right: { right(); break; }
      // prettier-ignore
      case ResizeHandlePlacement.bottom: { bottom(); break; }
      // prettier-ignore
      case ResizeHandlePlacement.topLeft: { left(top()); break; }
      // prettier-ignore
      case ResizeHandlePlacement.topRight: { right(top()); break; }
      // prettier-ignore
      case ResizeHandlePlacement.bottomLeft: { left(bottom()); break; }
      // prettier-ignore
      case ResizeHandlePlacement.bottomRight: { right(bottom()); break; }
    }

    const newRectInit: UIRecordRectInit = pick(UIRecordQuad.fromQuad(newQuadInit).getLayout().toJSON(), [
      'x',
      'y',
      'width',
      'height',
      'rotate',
    ]);

    newRectInit.x = Math.round(newRectInit.x);
    newRectInit.y = Math.round(newRectInit.y);
    newRectInit.width = Math.round(newRectInit.width);
    newRectInit.height = Math.round(newRectInit.height);
    newRectInit.rotate = rect.rotate;

    const newRect = UIRecordRect.fromRect(newRectInit);
    setRef(transformLastRectRef, newRect);

    changeSizeText(rect);
    onTransform?.({ target, record, type: 'resize', rect: newRect });
  });

  return {
    onResizeHandleMouseDown,
    onMouseUpForResize,
    onMouseMoveForResize,
  };
}

export type UseResizeHandlersType = ReturnType<typeof useResizeHandlers>;
