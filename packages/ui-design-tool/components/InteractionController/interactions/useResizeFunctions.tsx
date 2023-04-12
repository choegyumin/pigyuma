import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { HandlePlacement } from '@/types/Identifier';
import { setRef } from '@pigyuma/react-utils';
import { isEqual } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { BaseInteractionPayload, InteractionTarget, ResizingPayload } from '../types';
import { getResizingCornerCursor, getResizingCursor } from '../utils/cursor';
import { calcResizedRect } from '../utils/rect';

const checkGrabbingCorner = (handlePlacement: HandlePlacement) =>
  ([HandlePlacement.topLeft, HandlePlacement.topRight, HandlePlacement.bottomLeft, HandlePlacement.bottomRight] as string[]).includes(
    handlePlacement,
  );

/** @todo 여러 레이어를 한번에 resize 할 수 있도록 개선 */
const pickTarget = (targets: InteractionTarget[]): InteractionTarget | undefined => {
  return targets[0];
};

export default function useResizeFunctions() {
  const [taskPayload, setTaskPayload] = useState<ResizingPayload>();

  const transformLastRectRef = useRef<UIRecordRect>();
  const resizeHandlePlacementRef = useRef<HandlePlacement>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const { setCursor } = useDispatcher();

  const resizePrepare = useCallback((taskPayload: ResizingPayload) => {
    const {
      details: { targets, handlePlacement },
    } = taskPayload;

    const target = pickTarget(targets);
    if (target == null) {
      return;
    }

    const { rect } = target;

    setTaskPayload(taskPayload);
    setRef(transformLastRectRef, rect);
    setRef(resizeHandlePlacementRef, handlePlacement);
  }, []);

  const resizeExecute = useCallback(
    (pingPayload: BaseInteractionPayload) => {
      if (taskPayload == null) {
        return console.error(`Resize interaction is not initialized. Call resizePrepare() first.`);
      }

      const {
        details: { targets, handlePlacement },
      } = taskPayload;

      const target = pickTarget(targets);
      if (target == null) {
        return;
      }

      const { mouse, keyboard } = pingPayload;
      const { record, rect: initialRect } = target;

      const clientPoint = { x: mouse.clientX, y: mouse.clientY };
      const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };
      const fromCenter = keyboard.altKey;
      const isGrabbingCorner = checkGrabbingCorner(handlePlacement || '');

      const newRect = handlePlacement != null ? calcResizedRect(initialRect, offsetPoint, handlePlacement, fromCenter) : initialRect;

      if (!isEqual(newRect.toJSON(), transformLastRectRef.current?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiController.setRect(record.key, newRect);
      }
      // cursor는 viewport에 의존해야 하므로, cursor 관련 로직은 별도의 함수에 테스트 작성 (uiSelector 접근)
      setCursor(
        isGrabbingCorner
          ? getResizingCornerCursor(uiSelector.query({ key: record.key })!, clientPoint)
          : getResizingCursor(newRect.rotate, handlePlacement),
      );
    },
    [taskPayload, uiController, uiSelector, setCursor],
  );

  const resizeEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (pingPayload: BaseInteractionPayload) => {
      setTaskPayload(undefined);
      setRef(transformLastRectRef, undefined);
      setRef(resizeHandlePlacementRef, undefined);
      setCursor(undefined);

      if (taskPayload == null) {
        console.warn(`Resize interaction is not initialized.`);
      }
    },
    [taskPayload, setCursor],
  );

  return { resizePrepare, resizeStart: resizeExecute, resizeExecute, resizeEnd };
}
