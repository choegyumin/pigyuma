import useBrowserMeta from '@/hooks/useBrowserMeta';
import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordQuad, UIRecordQuadInit, UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { HandlePlacement, UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { cursor } from '@pigyuma/css-utils';
import { setRef } from '@pigyuma/react-utils';
import { calcCoordByDistance, calcDistancePointFromLine, isEqual, pick } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';

const getTransformedRect = (
  rect: UIRecordRect,
  mousePoint: { x: number; y: number },
  handlePlacement: HandlePlacement,
  fromCenter: boolean,
) => {
  const quad = UIRecordQuad.fromRect(rect);

  const newQuadInit: UIRecordQuadInit = quad.toJSON();

  const getDiff = (distance: number) => distance * (fromCenter ? 2 : 1);

  const left = (flip = false) => {
    let distance = -calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p4], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.width + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 180, flip ? -distance : distance);
    newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 180, flip ? -distance : distance);
    if (fromCenter) {
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 180, flip ? distance : -distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 180, flip ? distance : -distance);
    }
    return rect.width + getDiff(distance) < 0;
  };
  const right = (flip = false) => {
    let distance = calcDistancePointFromLine([newQuadInit.p2, newQuadInit.p3], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.width + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 0, flip ? -distance : distance);
    newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 0, flip ? -distance : distance);
    if (fromCenter) {
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 0, flip ? distance : -distance);
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 0, flip ? distance : -distance);
    }
    return rect.width + getDiff(distance) < 0;
  };
  const top = () => {
    let distance = calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p2], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.height + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 90, distance);
    newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 90, distance);
    if (fromCenter) {
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 90, -distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 90, -distance);
    }
    return rect.height + getDiff(distance) < 0;
  };
  const bottom = () => {
    let distance = -calcDistancePointFromLine([newQuadInit.p4, newQuadInit.p3], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.height + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 270, distance);
    newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 270, distance);
    if (fromCenter) {
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 270, -distance);
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 270, -distance);
    }
    return rect.height + getDiff(distance) < 0;
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
  newRectInit.width = Math.max(Math.round(newRectInit.width), 1);
  newRectInit.height = Math.max(Math.round(newRectInit.height), 1);
  newRectInit.rotate = rect.rotate;

  return UIRecordRect.fromRect(newRectInit);
};

const getResizeCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.resizePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

export default function useResizeFunctions() {
  const [targetKey, setTargetKey] = useState<UIRecordKey>();

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const resizeHandlePlacementRef = useRef<HandlePlacement>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();
  const getItemReference = useItemReference();

  const { setCursor } = useDispatcher();

  const startResize = useCallback(
    (recordKey: UIRecordKey, handle: HandlePlacement) => {
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
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
      setCursor(getResizeCursor(target, mouseClientPoint));
    },
    [uiSelector, getBrowserMeta, getItemReference, setCursor],
  );

  const endResize = useCallback(() => {
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
    setRef(resizeHandlePlacementRef, undefined);
    uiController.setRect(record.key, rect);
  }, [targetKey, uiController, uiSelector, getItemReference]);

  const resize = useCallback(() => {
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

    const newRect = handlePlacement != null ? getTransformedRect(initialRect, mouseOffsetPoint, handlePlacement, fromCenter) : initialRect;

    if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
      setRef(transformLastRectRef, newRect);
      uiController.setRect(record.key, newRect);
    }
    if (isGrabbingCorner) {
      setCursor(getResizeCursor(target, mouseClientPoint));
    }
  }, [targetKey, uiController, uiSelector, getBrowserMeta, getItemReference, setCursor]);

  return { startResize, resize, endResize };
}
