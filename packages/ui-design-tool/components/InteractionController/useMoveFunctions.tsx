import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef } from '@pigyuma/react-utils';
import { isEqual, pick } from '@pigyuma/utils';
import { useCallback, useRef } from 'react';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';

const getTransformedRect = (rect: UIRecordRect, mousePoint: { x: number; y: number }, handleCoord: { x: number; y: number }) => {
  const newRectInit: UIRecordRectInit = pick(rect, ['x', 'y', 'width', 'height', 'rotate']);

  newRectInit.x = newRectInit.x + (mousePoint.x - handleCoord.x);
  newRectInit.y = newRectInit.y + (mousePoint.y - handleCoord.y);

  return UIRecordRect.fromRect(newRectInit);
};

const MOVE_CURSOR = 'grab';

export default function useMoveFunctions(recordKey: UIRecordKey | undefined) {
  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const moveHandleCoordRef = useRef<{ x: number; y: number }>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const startMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: MouseEvent) => {
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
      const target = isUIRecordKey(recordKey) ? uiSelector.query({ key: recordKey }) : undefined;
      if (record == null || target == null) {
        return;
      }

      const browserMeta = getBrowserMeta();
      const mouseMeta = browserMeta.mouse;
      const mouseOffsetPoint = { x: mouseMeta.offsetX, y: mouseMeta.offsetY };

      const rect = UIRecordRect.fromRect(UIRecordRect.fromElement(target).toJSON());

      setRef(transformInitialRectRef, rect);
      setRef(transformLastRectRef, transformInitialRectRef.current);
      setRef(moveHandleCoordRef, mouseOffsetPoint);
      setCursor(MOVE_CURSOR);
    },
    [recordKey, uiSelector, getBrowserMeta, getItemReference, setCursor],
  );

  const endMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: MouseEvent) => {
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
      setRef(moveHandleCoordRef, undefined);
      uiController.setRect(record.key, rect);
    },
    [recordKey, uiController, uiSelector, getItemReference],
  );

  const move = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: MouseEvent) => {
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
      const handleCoord = moveHandleCoordRef.current;

      const newRect = handleCoord != null ? getTransformedRect(initialRect, mouseOffsetPoint, handleCoord) : initialRect;

      if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiController.setRect(record.key, newRect);
      }
      setCursor(MOVE_CURSOR);
    },
    [recordKey, uiController, uiSelector, getBrowserMeta, getItemReference, setCursor],
  );

  return { startMove, endMove, move };
}
