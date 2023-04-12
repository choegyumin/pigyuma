import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { setRef } from '@pigyuma/react-utils';
import { calcDegreesBetweenCoords, isEqual } from '@pigyuma/utils';
import { useCallback, useRef, useState } from 'react';
import { BaseInteractionPayload, InteractionTarget, RotatingPayload } from '../types';
import { getRotatingCursor } from '../utils/cursor';
import { calcRotatedRect } from '../utils/rect';

/** @todo 여러 레이어를 한번에 rotate 할 수 있도록 개선 */
const pickTarget = (targets: InteractionTarget[]): InteractionTarget | undefined => {
  return targets[0];
};

export default function useRotateFunctions() {
  const [taskPayload, setTaskPayload] = useState<RotatingPayload>();

  const transformLastRectRef = useRef<UIRecordRect>();
  const rotateHandleCoordDegreesRef = useRef<number>();

  const uiController = useUIController();
  const uiSelector = useUISelector();

  const { setCursor } = useDispatcher();

  const rotatePrepare = useCallback((taskPayload: RotatingPayload) => {
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
    setRef(rotateHandleCoordDegreesRef, calcDegreesBetweenCoords({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, offsetPoint));
  }, []);

  const rotateExecute = useCallback(
    (pingPayload: BaseInteractionPayload) => {
      if (taskPayload == null) {
        return console.error(`Rotate interaction is not initialized. Call rotatePrepare() first.`);
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

      const clientPoint = { x: mouse.clientX, y: mouse.clientY };
      const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };
      const lastRect = transformLastRectRef.current;
      const handleCoordDegrees = rotateHandleCoordDegreesRef.current;

      const newRect = handleCoordDegrees != null ? calcRotatedRect(initialRect, offsetPoint, handleCoordDegrees) : initialRect;

      if (!isEqual(newRect.toJSON(), lastRect?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiController.setRect(record.key, newRect);
      }
      // cursor는 viewport에 의존해야 하므로, cursor 관련 로직은 별도의 함수에 테스트 작성 (uiSelector 접근)
      setCursor(getRotatingCursor(uiSelector.query({ key: record.key })!, clientPoint));
    },
    [taskPayload, uiController, uiSelector, setCursor],
  );

  const rotateEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (pingPayload: BaseInteractionPayload) => {
      setTaskPayload(undefined);
      setRef(transformLastRectRef, undefined);
      setRef(rotateHandleCoordDegreesRef, undefined);
      setCursor(undefined);

      if (taskPayload == null) {
        console.warn(`Rotate interaction is not initialized.`);
      }
    },
    [taskPayload, setCursor],
  );

  return { rotatePrepare, rotateStart: rotateExecute, rotateExecute, rotateEnd };
}
