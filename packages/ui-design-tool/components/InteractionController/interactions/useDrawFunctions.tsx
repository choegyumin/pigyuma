import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import { UIRecordRect } from '@/types/Geometry';
import { HandlePlacement } from '@/types/Identifier';
import { setRef } from '@pigyuma/react-utils';
import { isEqual } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { BaseInteractionPayload, DrawingPayload } from '../types';
import { getDrawingCursor } from '../utils/cursor';
import { calcResizedRect } from '../utils/rect';

export default function useDrawFunctions() {
  const [taskPayload, setTaskPayload] = useState<DrawingPayload>();

  const transformLastRectRef = useRef<UIRecordRect>();

  const uiController = useUIController();

  const { setCursor } = useDispatcher();

  const drawPrepare = useCallback((taskPayload: DrawingPayload) => {
    const {
      details: { target },
    } = taskPayload;

    if (target == null) {
      return;
    }

    const { rect } = target;

    setTaskPayload(taskPayload);
    setRef(transformLastRectRef, rect);
  }, []);

  const drawExecute = useCallback(
    (pingPayload: BaseInteractionPayload) => {
      if (taskPayload == null) {
        return console.error(`Draw interaction is not initialized. Call drawPrepare() first.`);
      }

      const {
        details: { target },
      } = taskPayload;

      if (target == null) {
        return;
      }

      const { mouse, keyboard } = pingPayload;
      const { record, rect: initialRect } = target;

      const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };
      const fromCenter = keyboard.altKey;

      const newRect = calcResizedRect(initialRect, offsetPoint, HandlePlacement.bottomRight, fromCenter);

      if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiController.setRect(record.key, newRect);
      }
      setCursor(getDrawingCursor);
    },
    [taskPayload, uiController, setCursor],
  );

  const drawEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (pingPayload: BaseInteractionPayload) => {
      setTaskPayload(undefined);
      setRef(transformLastRectRef, undefined);
      setCursor(undefined);

      if (taskPayload == null) {
        console.warn(`Draw interaction is not initialized.`);
      }
    },
    [taskPayload, setCursor],
  );

  return { drawPrepare, drawStart: drawExecute, drawExecute, drawEnd };
}
