import { UIRecordQuad, UIRecordRect, UIRecordRectInit } from '@/types/Shape';
import { isUIRecordKey } from '@/utils/model';
import { getUIRecordStyleValue } from '@/utils/style';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { cursor } from '@pigyuma/ui/styles/extensions';
import { calcDistancePointFromLine, pick } from '@pigyuma/utils';
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
  /** @todo */
  // eslint-disable-next-line
  resizeFromCenter: boolean,
) => {
  const quad = UIRecordQuad.fromRect(rect);
  const boundingRect = quad.getBounds();

  const newRectInit: UIRecordRectInit = pick(quad.getLayout().toJSON(), ['x', 'y', 'width', 'height', 'rotate']);

  const left = () => {
    const distance = calcDistancePointFromLine([quad.p1, quad.p4], mousePoint);
    const size = rect.width + distance;
    const flip = size < 0;
    newRectInit.width = Math.abs(size);
    if (flip) {
      newRectInit.x = rect.x + rect.width;
    } else {
      newRectInit.x = rect.x - distance;
    }
  };
  const top = () => {
    const distance = -calcDistancePointFromLine([quad.p1, quad.p2], mousePoint);
    const size = rect.height + distance;
    const flip = size < 0;
    newRectInit.height = Math.abs(size);
    if (flip) {
      newRectInit.y = rect.y + rect.height;
    } else {
      newRectInit.y = rect.y - distance;
    }
  };
  const right = () => {
    const distance = -calcDistancePointFromLine([quad.p2, quad.p3], mousePoint);
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
    if (0 < rect.rotate && rect.rotate < 180) {
      movement.y = -movement.y;
    }
    if (90 < rect.rotate && rect.rotate < 270) {
      movement.x = boundingRect.width - transformedBounds.width - (transformedBounds.x - boundingRect.x);
      if (flip) {
        const asdf = boundingRect.width - zeroBounds.width - (zeroBounds.x - boundingRect.x);
        movement.x = asdf - (transformedBounds.x - zeroBounds.x);
      }
    }
    newRectInit.x = rect.x + movement.x;
    newRectInit.y = rect.y + movement.y;
    newRectInit.width = Math.abs(size);
  };
  const bottom = () => {
    const distance = -calcDistancePointFromLine([quad.p3, quad.p4], mousePoint);
    const size = rect.height + distance;
    const flip = size < 0;
    newRectInit.height = Math.abs(size);
    if (flip) {
      newRectInit.y = rect.y + size;
    }
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
    case HandlePlacement.topLeft: { top(); left(); break; }
    // prettier-ignore
    case HandlePlacement.topRight: { top(); right(); break; }
    // prettier-ignore
    case HandlePlacement.bottomLeft: { bottom(); left(); break; }
    // prettier-ignore
    case HandlePlacement.bottomRight: { bottom(); right(); break; }
  }

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
    data: { selectedRecordKey, transformInitialRectRef, transformLastRectRef, resizeFromCenterRef, resizeHandlePlacementRef },
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

    const mouseMeta = context.getBrowserMeta().mouse;

    const isGrabbingCorner = (
      [HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]
    ).includes(handle || '');

    const rotate = parseFloat(getUIRecordStyleValue(target, 'rotate')) || 0;
    const rect = UIRecordRect.fromRect({ ...UIRecordRect.fromElement(target).toJSON(), rotate });

    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(resizeHandlePlacementRef, handle);
    context.setCursor(isGrabbingCorner ? getResizeCursor(target, mouseMeta) : event.target.style.getPropertyValue('cursor'));
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

    const mouseMeta = context.getBrowserMeta().mouse;
    const handlePlacement = resizeHandlePlacementRef.current;
    const fromCenter = resizeFromCenterRef.current;
    const isGrabbingCorner = (
      [HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]
    ).includes(handlePlacement || '');

    const newRect = handlePlacement ? getTransformedRect(initialRect, mouseMeta, handlePlacement, fromCenter) : initialRect;

    setRef(transformLastRectRef, newRect);
    context.setRect(record.key, newRect);
    if (isGrabbingCorner) {
      context.setCursor(getResizeCursor(target, mouseMeta));
    }
  });

  const onDocuemntKeyDownUpForResize = useEvent(() => {
    if (context.status !== 'resizing') {
      return setRef(resizeFromCenterRef, false);
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

    const keyboardMeta = context.getBrowserMeta().keyboard;
    const fromCenter = keyboardMeta.alt;
    const handlePlacement = resizeHandlePlacementRef.current;

    const mouseMeta = context.getBrowserMeta().mouse;

    const newRect = handlePlacement ? getTransformedRect(initialRect, mouseMeta, handlePlacement, fromCenter) : initialRect;

    setRef(resizeFromCenterRef, fromCenter);
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
