import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { cursor } from '@pigyuma/css-utils';
import { setRef } from '@pigyuma/react-utils';
import { calcDegreesBetweenCoords, isEqual, pick, toDegrees360 } from '@pigyuma/utils';
import { useCallback, useRef } from 'react';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';

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

const getRotateCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.rotatePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

export default function useRotateFunctions(recordKey: UIRecordKey | undefined) {
  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const rotateHandleCoordDegreesRef = useRef<number>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const startRotate = useCallback(() => {
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    const target = isUIRecordKey(recordKey) ? uiSelector.query({ key: recordKey }) : undefined;
    if (record == null || target == null) {
      return;
    }

    const browserMeta = getBrowserMeta();
    const mouseMeta = browserMeta.mouse;
    const mouseOffsetPoint = { x: mouseMeta.offsetX, y: mouseMeta.offsetY };
    const mouseClientPoint = { x: mouseMeta.clientX, y: mouseMeta.clientY };

    const rect = UIRecordRect.fromRect(UIRecordRect.fromElement(target).toJSON());

    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(
      rotateHandleCoordDegreesRef,
      calcDegreesBetweenCoords({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mouseOffsetPoint),
    );
    setCursor(getRotateCursor(target, mouseClientPoint));
  }, [recordKey, uiSelector, getBrowserMeta, getItemReference, setCursor]);

  const endRotate = useCallback(() => {
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? uiSelector.query({ key: recordKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

    setRef(transformInitialRectRef, undefined);
    setRef(transformLastRectRef, undefined);
    setRef(rotateHandleCoordDegreesRef, undefined);
    uiController.setRect(record.key, rect);
  }, [recordKey, uiController, uiSelector, getItemReference]);

  const rotate = useCallback(() => {
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = isUIRecordKey(recordKey) ? uiSelector.query({ key: recordKey }) : undefined;
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
    const handleCoordDegrees = rotateHandleCoordDegreesRef.current;

    const newRect = handleCoordDegrees != null ? getTransformedRect(initialRect, mouseOffsetPoint, handleCoordDegrees) : initialRect;

    if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
      setRef(transformLastRectRef, newRect);
      uiController.setRect(record.key, newRect);
    }
    setCursor(getRotateCursor(target, mouseClientPoint));
  }, [recordKey, uiController, uiSelector, getBrowserMeta, getItemReference, setCursor]);

  return { startRotate, endRotate, rotate };
}
