import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useBrowserMeta, useDispatcher, useItemReference, useStatus, useUIController, useUIElement } from '@/hooks';
import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { isUIRecordKey } from '@/utils/model';
import { getComputedUIRecordStyleValue } from '@/utils/style';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { cursor } from '@pigyuma/ui/extensions';
import { calcDegreesBetweenCoords, isEqual, pick, toDegrees360 } from '@pigyuma/utils';
import { UseDataType } from './useData';

export type UseRotateHandlersDependencys = {
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
    data: { selectedRecordKey, transformInitialRectRef, transformLastRectRef, rotateHandleCoordDegreesRef },
  } = deps;

  const uiControllerAPI = useUIController();
  const uiElementAPI = useUIElement();

  const getItemReference = useItemReference();

  const getBrowserMeta = useBrowserMeta();
  const status = useStatus();

  const { setCursor, setStatus } = useDispatcher();

  const onRotateHandleMouseDown = useEvent(() => {
    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    const target = isUIRecordKey(recordKey) ? uiElementAPI.query({ key: recordKey }) : undefined;
    if (record == null || target == null) {
      return;
    }

    const browserMeta = getBrowserMeta();
    const mouseMeta = browserMeta.mouse;
    const mouseOffsetPoint = { x: mouseMeta.offsetX, y: mouseMeta.offsetY };
    const mouseClientPoint = { x: mouseMeta.clientX, y: mouseMeta.clientY };

    const rotate = parseFloat(getComputedUIRecordStyleValue(target, 'rotate')) || 0;
    const rect = UIRecordRect.fromRect({ ...UIRecordRect.fromElement(target).toJSON(), rotate });

    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(
      rotateHandleCoordDegreesRef,
      calcDegreesBetweenCoords({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mouseOffsetPoint),
    );
    setCursor(getRotateCursor(target, mouseClientPoint));
    setStatus(UIDesignToolStatus.rotating);
  });

  const onDocumentMouseUpForRotate = useEvent(() => {
    if (status !== 'rotating') {
      return;
    }

    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? uiElementAPI.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

    setRef(transformInitialRectRef, undefined);
    setRef(transformLastRectRef, undefined);
    setRef(rotateHandleCoordDegreesRef, undefined);
    uiControllerAPI.setRect(record.key, rect);
    setStatus(UIDesignToolStatus.idle);
  });

  const onDocumentMouseMoveForRotate = useEvent(() => {
    if (status !== 'rotating') {
      return;
    }

    const recordKey = selectedRecordKey;
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? uiElementAPI.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const initialRect = transformInitialRectRef.current;
    if (initialRect == null) {
      throw new Error("'rotate' event was not properly initialized.");
    }

    const browserMeta = getBrowserMeta();
    const mouseMeta = browserMeta.mouse;
    const mouseOffsetPoint = { x: mouseMeta.offsetX, y: mouseMeta.offsetY };
    const mouseClientPoint = { x: mouseMeta.clientX, y: mouseMeta.clientY };
    const handleCoordDegrees = rotateHandleCoordDegreesRef.current ?? 0;

    const newRect = getTransformedRect(initialRect, mouseOffsetPoint, handleCoordDegrees);

    if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
      setRef(transformLastRectRef, newRect);
      uiControllerAPI.setRect(record.key, newRect);
    }
    setCursor(getRotateCursor(target, mouseClientPoint));
  });

  return {
    onRotateHandleMouseDown,
    onDocumentMouseUpForRotate,
    onDocumentMouseMoveForRotate,
  };
}

export type UseRotateHandlersType = ReturnType<typeof useRotateHandlers>;
