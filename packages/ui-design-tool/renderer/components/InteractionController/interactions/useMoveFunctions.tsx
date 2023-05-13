import useDispatcher from '@/renderer/hooks/useDispatcher';
import useUIController from '@/renderer/hooks/useUIController';
import { UIRecordRect } from '@/types/Geometry';
import { setRef } from '@pigyuma/react-utils';
import { isEqual } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { BaseInteractionPayload, InteractionTarget, MovingPayload } from '../types';
import { getMovingCursor } from '../utils/cursor';
import { calcMovedRect } from '../utils/rect';

/** @todo 여러 레이어를 한번에 resize 할 수 있도록 개선 */
const pickTarget = (targets: InteractionTarget[]): InteractionTarget | undefined => {
  return targets[0];
};

export default function useMoveFunctions() {
  const [taskPayload, setTaskPayload] = useState<MovingPayload>();

  const transformLastRectRef = useRef<UIRecordRect>();
  const moveHandleCoordRef = useRef<{ x: number; y: number }>();

  const uiController = useUIController();

  const { setCursor } = useDispatcher();

  const movePrepare = useCallback((taskPayload: MovingPayload) => {
    const {
      mouse,
      details: { targets },
    } = taskPayload;

    const target = pickTarget(targets);
    if (target == null) {
      return;
    }

    const { rect } = target;

    const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };

    setTaskPayload(taskPayload);
    setRef(transformLastRectRef, rect);
    setRef(moveHandleCoordRef, offsetPoint);
  }, []);

  const moveExecute = useCallback(
    (pingPayload: BaseInteractionPayload) => {
      if (taskPayload == null) {
        return console.error(`Move interaction is not initialized. Call movePrepare() first.`);
      }

      const {
        details: { targets },
      } = taskPayload;

      const target = pickTarget(targets);
      if (target == null) {
        return;
      }

      const { mouse } = pingPayload;
      const { record, rect: initialRect } = target;

      const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };
      const handleCoord = moveHandleCoordRef.current;

      const newRect = handleCoord != null ? calcMovedRect(initialRect, offsetPoint, handleCoord) : initialRect;

      if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiController.setRect(record.key, newRect);
      }
      setCursor(getMovingCursor());
    },
    [taskPayload, uiController, setCursor],
  );

  const moveEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (pingPayload: BaseInteractionPayload) => {
      setTaskPayload(undefined);
      setRef(transformLastRectRef, undefined);
      setRef(moveHandleCoordRef, undefined);
      setCursor(undefined);

      if (taskPayload == null) {
        console.warn(`Resize interaction is not initialized.`);
      }
    },
    [taskPayload, setCursor],
  );

  return { movePrepare, moveStart: moveExecute, moveExecute, moveEnd };
}
