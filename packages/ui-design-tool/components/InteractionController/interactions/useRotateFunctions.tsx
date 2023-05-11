import useDispatcher from '@/hooks/useDispatcher';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { RotatableUIRecord } from '@/utils/model';
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
    // const quad = UIRecordQuad.fromRect(rect);

    const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };
    // const offsetPoint = (() => {
    //   if (handlePlacement === 'topLeft') {
    //     return quad.toJSON().p1;
    //   }
    //   if (handlePlacement === 'topRight') {
    //     return quad.toJSON().p2;
    //   }
    //   if (handlePlacement === 'bottomRight') {
    //     return quad.toJSON().p3;
    //   }
    //   return quad.toJSON().p4;
    // })();

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

      const { mouse, keyboard } = pingPayload;
      const { record, rect: initialRect } = target;

      const clientPoint = { x: mouse.clientX, y: mouse.clientY };
      const offsetPoint = { x: mouse.offsetX, y: mouse.offsetY };
      const precision = keyboard.ctrlKey;
      const lastRect = transformLastRectRef.current;
      const handleCoordDegrees = rotateHandleCoordDegreesRef.current;

      const newRect =
        handleCoordDegrees != null
          ? calcRotatedRect(initialRect, (record as RotatableUIRecord).values.rotate.degrees, offsetPoint, handleCoordDegrees, {
              precision,
            })
          : initialRect;

      if (!isEqual(newRect.toJSON(), lastRect?.toJSON())) {
        setRef(transformLastRectRef, newRect);
        uiController.setRect(record.key, newRect);
      }
      // cursor는 viewport를 기반해 정의해야 하므로 uiSelector를 통해 DOM에 접근함
      // DOM 의존성 제거를 위해 cursor 관련 로직을 분리하면 계산 로직이 중복되고, 추상화하더라도 복잡도가 올라감
      // 따라서 굳이 로직을 분리하는 대신, `getRotatingCursor` 등의 함수에 테스트 작성
      // (`uiSelector.query()` 결과는 항상 있지만 테스트를 위해 `document.body`를 주입)
      setCursor(getRotatingCursor(uiSelector.query({ key: record.key }) ?? document.body, clientPoint));
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
