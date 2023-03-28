import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { HandlePlacement, UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef } from '@pigyuma/react-utils';
import { isEqual } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { getResizingCursor } from './cursor';
import { calcResizedRect } from './rect';

/** @todo useResizeFunctions와 로직을 공유하도록 추상화(리팩토링), 기능만 재사용할 뿐 보여지는 UI는 달라야 함 */
export default function useDrawFunctions() {
  const [targetKey, setTargetKey] = useState<UIRecordKey>();

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const resizeHandlePlacementRef = useRef<HandlePlacement>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const drawStart = useCallback(
    (recordKey: UIRecordKey, handle: HandlePlacement) => {
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey, { includeDraft: true }) : undefined;
      if (record == null) {
        return console.error(`UIRecord '${recordKey}' not found.`);
      }

      const target = isUIRecordKey(recordKey) ? uiSelector.query({ key: recordKey }) : undefined;
      if (target == null) {
        return console.error(`element with recordKey of '${recordKey}' not found.`);
      }

      const browserMeta = getBrowserMeta();
      const mouseMeta = browserMeta.mouse;
      const mouseClientPoint = { x: mouseMeta.clientX, y: mouseMeta.clientY };

      const rect = UIRecordRect.fromRect(UIRecordRect.fromElement(target).toJSON());

      setTargetKey(recordKey);
      setRef(transformInitialRectRef, rect);
      setRef(transformLastRectRef, transformInitialRectRef.current);
      setRef(resizeHandlePlacementRef, handle);
      setCursor(getResizingCursor(target, mouseClientPoint));
    },
    [uiSelector, getBrowserMeta, getItemReference, setCursor],
  );

  const drawEnd = useCallback(() => {
    const record = isUIRecordKey(targetKey) ? getItemReference(targetKey, { includeDraft: true }) : undefined;
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
    setRef(resizeHandlePlacementRef, undefined);
    uiController.setRect(record.key, rect, { saveDraft: true });
    uiController.flushDrafts();
  }, [targetKey, uiController, uiSelector, getItemReference]);

  const drawInProgress = useCallback(() => {
    const record = isUIRecordKey(targetKey) ? getItemReference(targetKey, { includeDraft: true }) : undefined;
    if (record == null) {
      return console.error(`UIRecord '${targetKey}' not found.`);
    }

    const target = isUIRecordKey(targetKey) ? uiSelector.query({ key: targetKey }) : undefined;
    if (target == null) {
      return console.error(`Element with recordKey of '${targetKey}' not found.`);
    }

    const initialRect = transformInitialRectRef.current;
    if (initialRect == null) {
      throw new Error("'resize' event was not properly initialized.");
    }

    const browserMeta = getBrowserMeta();
    const mouseMeta = browserMeta.mouse;
    const mouseOffsetPoint = { x: mouseMeta.offsetX, y: mouseMeta.offsetY };
    const mouseClientPoint = { x: mouseMeta.clientX, y: mouseMeta.clientY };
    const keyboardMeta = browserMeta.keyboard;

    const fromCenter = keyboardMeta.altKey;
    const handlePlacement = resizeHandlePlacementRef.current;
    const isGrabbingCorner = (
      [HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]
    ).includes(handlePlacement || '');

    const newRect = handlePlacement != null ? calcResizedRect(initialRect, mouseOffsetPoint, handlePlacement, fromCenter) : initialRect;

    if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
      setRef(transformLastRectRef, newRect);
      uiController.setRect(record.key, newRect, { saveDraft: true });
    }
    if (isGrabbingCorner) {
      setCursor(getResizingCursor(target, mouseClientPoint));
    }
  }, [targetKey, uiController, uiSelector, getBrowserMeta, getItemReference, setCursor]);

  return { drawStart, drawEnd, drawInProgress };
}
