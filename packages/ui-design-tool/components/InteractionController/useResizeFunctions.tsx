import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordQuad, UIRecordQuadInit, UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { UIInteractionElementDataset, UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { getComputedUIRecordStyleValue } from '@/utils/style';
import { cursor } from '@pigyuma/design-system/extensions';
import { setRef } from '@pigyuma/react-utils';
import { calcCoordByDistance, calcDistancePointFromLine, isEqual, pick } from '@pigyuma/utils';
import { useCallback, useRef } from 'react';
import { HandlePlacement } from '../SelectionOverlay/types';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';

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
    return rect.width + diff <= 0;
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
    return rect.height + diff <= 0;
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

const getResizeCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.resizePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

export default function useResizeFunctions(recordKey: UIRecordKey | undefined) {
  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const resizeHandlePlacementRef = useRef<HandlePlacement>();

  const uiControllerAPI = useUIController();
  const uiSelectorAPI = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const startResize = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement) || event.target.dataset[UIInteractionElementDataset.handlePlacement] == null) {
        return;
      }
      const handle = event.target.dataset[UIInteractionElementDataset.handlePlacement] as HandlePlacement;

      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
      if (record == null) {
        return console.error(`UIRecord '${recordKey}' not found.`);
      }

      const target = isUIRecordKey(recordKey) ? uiSelectorAPI.query({ key: recordKey }) : undefined;
      if (target == null) {
        return console.error(`element with recordKey of '${recordKey}' not found.`);
      }

      const browserMeta = getBrowserMeta();
      const mouseMeta = browserMeta.mouse;
      const mouseClientPoint = { x: mouseMeta.clientX, y: mouseMeta.clientY };

      const isGrabbingCorner = (
        [HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]
      ).includes(handle || '');

      const rotate = parseFloat(getComputedUIRecordStyleValue(target, 'rotate')) || 0;
      const rect = UIRecordRect.fromRect({ ...UIRecordRect.fromElement(target).toJSON(), rotate });

      setRef(transformInitialRectRef, rect);
      setRef(transformLastRectRef, transformInitialRectRef.current);
      setRef(resizeHandlePlacementRef, handle);
      setCursor(isGrabbingCorner ? getResizeCursor(target, mouseClientPoint) : event.target.style.getPropertyValue('cursor'));
    },
    [recordKey, uiSelectorAPI, getBrowserMeta, getItemReference, setCursor],
  );

  const endResize = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: MouseEvent) => {
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
      if (record == null) {
        return console.error(`UIRecord '${recordKey}' not found.`);
      }

      const target = isUIRecordKey(recordKey) ? uiSelectorAPI.query({ key: recordKey }) : undefined;
      if (target == null) {
        return console.error(`Element with recordKey of '${recordKey}' not found.`);
      }

      const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

      setRef(transformInitialRectRef, undefined);
      setRef(transformLastRectRef, undefined);
      setRef(resizeHandlePlacementRef, undefined);
      uiControllerAPI.setRect(record.key, rect);
    },
    [recordKey, uiControllerAPI, uiSelectorAPI, getItemReference],
  );

  const resize = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: MouseEvent) => {
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
      if (record == null) {
        return console.error(`UIRecord '${recordKey}' not found.`);
      }

      const target = isUIRecordKey(recordKey) ? uiSelectorAPI.query({ key: recordKey }) : undefined;
      if (target == null) {
        return console.error(`Element with recordKey of '${recordKey}' not found.`);
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

      const newRect = handlePlacement ? getTransformedRect(initialRect, mouseOffsetPoint, handlePlacement, fromCenter) : initialRect;

      if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiControllerAPI.setRect(record.key, newRect);
      }
      if (isGrabbingCorner) {
        setCursor(getResizeCursor(target, mouseClientPoint));
      }
    },
    [recordKey, uiControllerAPI, uiSelectorAPI, getBrowserMeta, getItemReference, setCursor],
  );

  return { startResize, resize, endResize };
}
