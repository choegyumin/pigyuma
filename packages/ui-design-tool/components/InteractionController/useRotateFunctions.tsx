import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { cursor } from '@pigyuma/design-system/extensions';
import { setRef } from '@pigyuma/react-utils';
import { calcDegreesBetweenCoords, isEqual, pick, toDegrees360 } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
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

export default function useRotateFunctions() {
  const [targetKey, setTargetKey] = useState<UIRecordKey>();

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const rotateHandleCoordDegreesRef = useRef<number>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const startRotate = useCallback(
    (recordKey: UIRecordKey) => {
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

      setTargetKey(recordKey);
      setRef(transformInitialRectRef, rect);
      setRef(transformLastRectRef, transformInitialRectRef.current);
      setRef(
        rotateHandleCoordDegreesRef,
        calcDegreesBetweenCoords({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mouseOffsetPoint),
      );
      setCursor(getRotateCursor(target, mouseClientPoint));
    },
    [uiSelector, getBrowserMeta, getItemReference, setCursor],
  );

  const endRotate = useCallback(() => {
    const record = isUIRecordKey(targetKey) ? getItemReference(targetKey) : undefined;
    if (record == null) {
      setTargetKey(undefined);
      return console.warn(`UIRecord '${targetKey}' not found.`);
    }

    const target = isUIRecordKey(targetKey) ? uiSelector.query({ key: targetKey }) : undefined;
    if (target == null) {
      setTargetKey(undefined);
      return console.warn(`Element with recordKey of '${targetKey}' not found.`);
    }

    const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

    setTargetKey(undefined);
    setRef(transformInitialRectRef, undefined);
    setRef(transformLastRectRef, undefined);
    setRef(rotateHandleCoordDegreesRef, undefined);
    uiController.setRect(record.key, rect);
  }, [targetKey, uiController, uiSelector, getItemReference]);

  const rotate = useCallback(() => {
    const record = isUIRecordKey(targetKey) ? getItemReference(targetKey) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${targetKey}' not found.`);
    }

    const target = isUIRecordKey(targetKey) ? uiSelector.query({ key: targetKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${targetKey}' not found.`);
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
  }, [targetKey, uiController, uiSelector, getBrowserMeta, getItemReference, setCursor]);

  return { startRotate, endRotate, rotate };
}
