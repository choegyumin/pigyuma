import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef } from '@pigyuma/react-utils';
import { isEqual } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { getMovingCursor } from './cursor';
import { calcMovedRect } from './rect';

export default function useMoveFunctions() {
  const [targetKey, setTargetKey] = useState<UIRecordKey>();

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const moveHandleCoordRef = useRef<{ x: number; y: number }>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const moveStart = useCallback(
    (recordKey: UIRecordKey) => {
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
      const target = isUIRecordKey(recordKey) ? uiSelector.query({ key: recordKey }) : undefined;
      if (record == null || target == null) {
        return;
      }

      const browserMeta = getBrowserMeta();
      const mouseMeta = browserMeta.mouse;
      const mouseOffsetPoint = { x: mouseMeta.offsetX, y: mouseMeta.offsetY };

      const rect = UIRecordRect.fromRect(UIRecordRect.fromElement(target).toJSON());

      setTargetKey(recordKey);
      setRef(transformInitialRectRef, rect);
      setRef(transformLastRectRef, transformInitialRectRef.current);
      setRef(moveHandleCoordRef, mouseOffsetPoint);
      setCursor(getMovingCursor());
    },
    [uiSelector, getBrowserMeta, getItemReference, setCursor],
  );

  const moveEnd = useCallback(() => {
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
    setRef(moveHandleCoordRef, undefined);
    uiController.setRect(record.key, rect);
  }, [targetKey, uiController, uiSelector, getItemReference]);

  const moveInProgress = useCallback(() => {
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
    const handleCoord = moveHandleCoordRef.current;

    const newRect = handleCoord != null ? calcMovedRect(initialRect, mouseOffsetPoint, handleCoord) : initialRect;

    if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
      setRef(transformLastRectRef, newRect);
      uiController.setRect(record.key, newRect);
    }
    setCursor(getMovingCursor());
  }, [targetKey, uiController, uiSelector, getBrowserMeta, getItemReference, setCursor]);

  return { moveStart, moveEnd, moveInProgress };
}
