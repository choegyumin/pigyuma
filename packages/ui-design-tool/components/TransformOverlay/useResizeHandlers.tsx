import { UIRecordQuad, UIRecordQuadInit, UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { isUIRecordKey } from '@/utils/model';
import { getComputedUIRecordStyleValue } from '@/utils/style';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { cursor } from '@pigyuma/ui/styles/extensions';
import { calcCoordByDistance, calcDistancePointFromLine, pick } from '@pigyuma/utils';
import { WorkspaceInteraction } from '../Workspace/types';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import { HandlePlacement } from './types';
import { UseDataType } from './useData';

export type UseResizeHandlersDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
  data: UseDataType;
};

const getResizeCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.resizePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

const getTransformedRect = (
  rect: UIRecordRect,
  mousePoint: { x: number; y: number },
  handlePlacement: HandlePlacement,
  fromCenter: boolean,
) => {
  const quad = UIRecordQuad.fromRect(rect);

  const newQuadInit: UIRecordQuadInit = quad.toJSON();

  const left = (flip = false) => {
    const distance = -calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p4], mousePoint, { abs: false });
    newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 180, flip ? -distance : distance);
    newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 180, flip ? -distance : distance);
    if (fromCenter) {
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 180, flip ? distance : -distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 180, flip ? distance : -distance);
    }
    const diff = distance * (fromCenter ? 2 : 1);
    return rect.width + diff < 0;
  };
  const top = () => {
    const distance = calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p2], mousePoint, { abs: false });
    newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 90, distance);
    newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 90, distance);
    if (fromCenter) {
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 90, -distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 90, -distance);
    }
    const diff = distance * (fromCenter ? 2 : 1);
    return rect.height + diff < 0;
  };
  const right = (flip = false) => {
    const distance = calcDistancePointFromLine([newQuadInit.p2, newQuadInit.p3], mousePoint, { abs: false });
    newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 0, flip ? -distance : distance);
    newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 0, flip ? -distance : distance);
    if (fromCenter) {
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 0, flip ? distance : -distance);
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 0, flip ? distance : -distance);
    }
    const diff = distance * (fromCenter ? 2 : 1);
    return rect.width + diff < 0;
  };
  const bottom = () => {
    const distance = -calcDistancePointFromLine([newQuadInit.p4, newQuadInit.p3], mousePoint, { abs: false });
    newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 270, distance);
    newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 270, distance);
    if (fromCenter) {
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 270, -distance);
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 270, -distance);
    }
    const diff = distance * (fromCenter ? 2 : 1);
    return rect.height + diff < 0;
  };

  switch (handlePlacement) {
    // prettier-ignore
    case HandlePlacement.top: { top(); break; }
    // prettier-ignore
    case HandlePlacement.left: { left(); break; }
    // prettier-ignore
    case HandlePlacement.right: { right(); break; }
    // prettier-ignore
    case HandlePlacement.bottom: { bottom(); break; }
    // prettier-ignore
    case HandlePlacement.topLeft: { left(top()); break; }
    // prettier-ignore
    case HandlePlacement.topRight: { right(top()); break; }
    // prettier-ignore
    case HandlePlacement.bottomLeft: { left(bottom()); break; }
    // prettier-ignore
    case HandlePlacement.bottomRight: { right(bottom()); break; }
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

  return UIRecordRect.fromRect(newRectInit);
};

export default function useResizeHandlers(deps: UseResizeHandlersDependencys) {
  const {
    context,
    data: { selectedRecordKey, transformInitialRectRef, transformLastRectRef, resizeHandlePlacementRef },
  } = deps;

  const onResizeHandleMouseDown = useEvent((event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof HTMLElement) || event.target.dataset.handlePlacement == null) {
      return;
    }
    const handle = event.target.dataset.handlePlacement as HandlePlacement;

    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? context.get(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? context.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`element with recordKey of '${recordKey}' not found.`);
    }

    const browserMeta = context.getBrowserMeta();

    const isGrabbingCorner = (
      [HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]
    ).includes(handle || '');

    const rotate = parseFloat(getComputedUIRecordStyleValue(target, 'rotate')) || 0;
    const rect = UIRecordRect.fromRect({ ...UIRecordRect.fromElement(target).toJSON(), rotate });

    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(resizeHandlePlacementRef, handle);
    context.setCursor(isGrabbingCorner ? getResizeCursor(target, browserMeta.mouse) : event.target.style.getPropertyValue('cursor'));
    context.setInteraction(WorkspaceInteraction.resizing);
  });

  const onDocumentMouseUpForResize = useEvent(() => {
    if (context.status !== 'resizing') {
      return;
    }

    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? context.get(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? context.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

    setRef(transformInitialRectRef, undefined);
    setRef(transformLastRectRef, undefined);
    setRef(resizeHandlePlacementRef, undefined);
    context.setRect(record.key, rect);
    context.setInteraction(WorkspaceInteraction.idle);
  });

  const onDocumentMouseMoveForResize = useEvent(() => {
    if (context.status !== 'resizing') {
      return;
    }

    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? context.get(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? context.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const initialRect = transformInitialRectRef.current;
    if (initialRect == null) {
      throw new Error("'resize' event was not properly initialized.");
    }

    const browserMeta = context.getBrowserMeta();

    const fromCenter = browserMeta.keyboard.alt;
    const handlePlacement = resizeHandlePlacementRef.current;
    const isGrabbingCorner = (
      [HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]
    ).includes(handlePlacement || '');

    const newRect = handlePlacement ? getTransformedRect(initialRect, browserMeta.mouse, handlePlacement, fromCenter) : initialRect;

    setRef(transformLastRectRef, newRect);
    context.setRect(record.key, newRect);
    if (isGrabbingCorner) {
      context.setCursor(getResizeCursor(target, browserMeta.mouse));
    }
  });

  const onDocuemntKeyDownUpForResize = useEvent(() => {
    if (context.status !== 'resizing') {
      return;
    }

    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? context.get(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? context.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const initialRect = transformInitialRectRef.current;
    if (initialRect == null) {
      throw new Error("'resize' event was not properly initialized.");
    }

    const browserMeta = context.getBrowserMeta();

    const fromCenter = browserMeta.keyboard.alt;
    const handlePlacement = resizeHandlePlacementRef.current;

    const newRect = handlePlacement ? getTransformedRect(initialRect, browserMeta.mouse, handlePlacement, fromCenter) : initialRect;

    setRef(transformLastRectRef, newRect);
    context.setRect(record.key, newRect);
  });

  return {
    onResizeHandleMouseDown,
    onDocumentMouseUpForResize,
    onDocumentMouseMoveForResize,
    onDocuemntKeyDownUpForResize,
  };
}

export type UseResizeHandlersType = ReturnType<typeof useResizeHandlers>;
