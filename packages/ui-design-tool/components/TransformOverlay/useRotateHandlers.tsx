import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { isUIRecordKey } from '@/utils/model';
import { getComputedUIRecordStyleValue } from '@/utils/style';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { cursor } from '@pigyuma/ui/styles/extensions';
import { calcDegreesBetweenCoords, pick, toDegrees360 } from '@pigyuma/utils';
import { WorkspaceInteraction } from '../Workspace/types';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import { UseDataType } from './useData';

export type UseRotateHandlersDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
  data: UseDataType;
};

const getRotateCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.rotatePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

const getTransformedRect = (rect: UIRecordRect, mousePoint: { x: number; y: number }, handleCoordDegrees: number) => {
  const newRectInit: UIRecordRectInit = pick(rect, ['x', 'y', 'width', 'height', 'rotate']);

  let rotate = calcDegreesBetweenCoords(
    {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    },
    mousePoint,
  );
  rotate -= handleCoordDegrees;
  rotate += rect.rotate;
  rotate = Math.round(rotate);

  newRectInit.rotate = toDegrees360(rotate);

  return UIRecordRect.fromRect(newRectInit);
};

export default function useRotateHandlers(deps: UseRotateHandlersDependencys) {
  const {
    context,
    data: { selectedRecordKey, transformInitialRectRef, transformLastRectRef, rotateHandleCoordDegreesRef },
  } = deps;

  const onRotateHandleMouseDown = useEvent(() => {
    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? context.get(recordKey) : undefined;
    const target = isUIRecordKey(recordKey) ? context.query({ key: recordKey }) : undefined;
    if (record == null || target == null) {
      return;
    }

    const mouseMeta = context.getBrowserMeta().mouse;

    const rotate = parseFloat(getComputedUIRecordStyleValue(target, 'rotate')) || 0;
    const rect = UIRecordRect.fromRect({ ...UIRecordRect.fromElement(target).toJSON(), rotate });

    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(rotateHandleCoordDegreesRef, calcDegreesBetweenCoords({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mouseMeta));
    context.setCursor(getRotateCursor(target, mouseMeta));
    context.setInteraction(WorkspaceInteraction.rotating);
  });

  const onDocumentMouseUpForRotate = useEvent(() => {
    if (context.status !== 'rotating') {
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
    setRef(rotateHandleCoordDegreesRef, undefined);
    context.setRect(record.key, rect);
    context.setInteraction(WorkspaceInteraction.idle);
  });

  const onDocumentMouseMoveForRotate = useEvent(() => {
    if (context.status !== 'rotating') {
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
      throw new Error("'rotate' event was not properly initialized.");
    }

    const mouseMeta = context.getBrowserMeta().mouse;
    const handleCoordDegrees = rotateHandleCoordDegreesRef.current ?? 0;

    const newRect = getTransformedRect(initialRect, mouseMeta, handleCoordDegrees);
    setRef(transformLastRectRef, newRect);
    context.setRect(record.key, newRect);
    context.setCursor(getRotateCursor(target, mouseMeta));
  });

  return {
    onRotateHandleMouseDown,
    onDocumentMouseUpForRotate,
    onDocumentMouseMoveForRotate,
  };
}

export type UseRotateHandlersType = ReturnType<typeof useRotateHandlers>;
