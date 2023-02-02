import { UIRecordRect, UIRecordRectInit } from '@/types/Shape';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { calcDegreesBetweenCoords, pick, toDegrees360 } from '@pigyuma/utils';
import { useCallback } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseRotateHandlersDependencys = {
  api: UIDesignToolAPI;
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useRotateHandlers(deps: UseRotateHandlersDependencys) {
  const {
    api,
    props: { onTransformStart, onTransform, onTransformEnd },
    data: {
      selectedRecordRef,
      infoTextRef,
      transformStatusRef,
      transformInitialRectRef,
      transformLastRectRef,
      rotatingHandleCoordDegreesRef,
    },
    uiController: { switchSelectedUI, switchTransformUI },
  } = deps;

  const changeDegreesText = useCallback(
    (rotate: number | null) => {
      if (infoTextRef.current) {
        infoTextRef.current.textContent = rotate != null ? `${toDegrees360(rotate)}°` : '';
      }
    },
    [infoTextRef],
  );

  const onRotateHandleMouseDown = useEvent((event: React.MouseEvent<HTMLElement>) => {
    const record = selectedRecordRef.current;
    const recordKey = record?.key;
    const target = api.query({ key: recordKey || '' });
    if (target == null) {
      return;
    }

    const rect = UIRecordRect.fromElement(target);

    const cursor = {
      x: event.clientX,
      y: event.clientY,
    };

    switchTransformUI();
    setRef(transformStatusRef, 'rotating');
    setRef(transformInitialRectRef, rect);
    setRef(transformLastRectRef, transformInitialRectRef.current);
    setRef(rotatingHandleCoordDegreesRef, calcDegreesBetweenCoords({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, cursor));

    changeDegreesText(rect.rotate);
    onTransformStart?.({ target, record, type: 'rotate', rect });
  });

  const onMouseUpForRotate = useEvent(() => {
    if (transformStatusRef.current !== 'rotating') {
      return;
    }

    const record = selectedRecordRef.current;
    const recordKey = record?.key;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = api.query({ key: recordKey || '' });
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformLastRectRef.current ?? UIRecordRect.fromElement(target);

    switchSelectedUI();
    setRef(transformStatusRef, 'idle');
    setRef(transformInitialRectRef, undefined);
    setRef(transformLastRectRef, undefined);
    setRef(rotatingHandleCoordDegreesRef, undefined);

    changeDegreesText(null);
    onTransformEnd?.({ target, record, type: 'rotate', rect });
  });

  const onMouseMoveForRotate = useEvent((event: MouseEvent) => {
    if (transformStatusRef.current !== 'rotating') {
      return;
    }

    const record = selectedRecordRef.current;
    const recordKey = record?.key;
    if (record == null) {
      return console.error(`UIRecord '${recordKey}' not found.`);
    }

    const target = api.query({ key: recordKey || '' });
    if (target == null) {
      return console.error(`Element with recordKey of '${recordKey}' not found.`);
    }

    const rect = transformInitialRectRef.current;
    if (rect == null) {
      throw new Error("'rotate' event was not properly initialized.");
    }

    const cursor = {
      x: event.clientX,
      y: event.clientY,
    };

    const newRectInit: UIRecordRectInit = pick(rect, ['x', 'y', 'width', 'height', 'rotate']);

    let rotate = calcDegreesBetweenCoords(
      {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      },
      cursor,
    );
    rotate -= rotatingHandleCoordDegreesRef.current ?? 0;
    rotate += rect.rotate;
    rotate = Math.round(rotate);

    newRectInit.rotate = toDegrees360(rotate);

    const newRect = UIRecordRect.fromRect(newRectInit);
    setRef(transformLastRectRef, newRect);

    changeDegreesText(rotate);
    onTransform?.({ target, record, type: 'rotate', rect: newRect });
  });

  return {
    onRotateHandleMouseDown,
    onMouseUpForRotate,
    onMouseMoveForRotate,
  };
}

export type UseRotateHandlersType = ReturnType<typeof useRotateHandlers>;
