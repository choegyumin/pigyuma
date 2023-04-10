import { Artboard } from '@/api/Artboard/model';
import { Canvas } from '@/api/Canvas/model';
import { ShapeLayer } from '@/api/ShapeLayer/model';
import useDispatcher from '@/hooks/useDispatcher';
import useHovered from '@/hooks/useHovered';
import useItemReference from '@/hooks/useItemReference';
import useMode from '@/hooks/useMode';
import useSelected from '@/hooks/useSelected';
import useStatus from '@/hooks/useStatus';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import {
  UIInteractionElementDataAttributeName,
  UIInteractionElementDataset,
  UIDesignToolElementDataAttributeName,
  UIRecordKey,
  InteractionHandleType,
  UIRecordType,
} from '@/types/Identifier';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod, UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import { isUIRecordKey } from '@/utils/model';
import { getStatus } from '@/utils/status';
import { useEvent } from '@pigyuma/react-utils';
import { useMemo } from 'react';
import { useBrowserStatus } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { makeDefaultArtboardArgs, makeDefaultShapeLayerArgs } from './record';
import { InteractionTask } from './types';
import useInteractFunctions from './useInteractFunctions';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export default function useInteractionController() {
  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserStatus = useBrowserStatus();

  const mode = useMode();
  const currentStatus = useStatus();
  const hoveredRecordKey = useHovered();
  const selectedRecordKeys = useSelected();

  const getItemReference = useItemReference();

  const { setStatus } = useDispatcher();

  const { interactStart, interactInProgress, interactEnd } = useInteractFunctions();

  const waitingQueue = useMemo<Array<InteractionTask>>(() => [], []);
  const inProgressQueue = useMemo<Array<InteractionTask>>(() => [], []);

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolElementDataAttributeName.id}]`))) {
      return;
    }

    const {
      mouse: { offsetX, offsetY },
    } = getBrowserStatus();

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);
    const handleType = handle?.dataset[UIInteractionElementDataset.handleType] as InteractionHandleType | undefined;

    const interactionType: UIDesignToolInteractionType = (() => {
      if (mode === UIDesignToolMode.select) {
        return handleType != null ? UIDesignToolInteractionType.transform : UIDesignToolInteractionType.selection;
      }
      if (mode === UIDesignToolMode.artboard || mode === UIDesignToolMode.shape) {
        return UIDesignToolInteractionType.drawing;
      }
      if (mode === UIDesignToolMode.text) {
        return UIDesignToolInteractionType.input;
      }
      return UIDesignToolInteractionType.idle;
    })();

    const transformMethod: UIDesignToolTransformMethod = (() => {
      if (handleType == null) {
        return UIDesignToolTransformMethod.unable;
      }
      if (handleType === InteractionHandleType.select) {
        return UIDesignToolTransformMethod.move;
      }
      return handleType;
    })();

    const nextStatus: UIDesignToolStatus = getStatus({ interactionType, transformMethod });

    switch (interactionType) {
      case UIDesignToolInteractionType.selection: {
        uiController.select([]);

        waitingQueue.push({ event, status: nextStatus, calibrate: 5 });

        break;
      }

      case UIDesignToolInteractionType.drawing: {
        const isDrawingArtboard = mode === UIDesignToolMode.artboard;
        const isDrawingShape = mode === UIDesignToolMode.shape;

        const parentElement: HTMLElement = (() => {
          const canvas = uiSelector.query({ key: Canvas.key })!;
          if (isDrawingArtboard) {
            return canvas;
          }
          return (
            uiSelector.closest(
              { type: UIRecordType.artboard },
              isUIRecordKey(hoveredRecordKey) ? uiSelector.query({ key: hoveredRecordKey }) : null,
            ) ?? canvas
          );
        })();
        const parentRecordKey = uiSelector.dataset(parentElement).key ?? Canvas.key;
        const parentRecord = getItemReference<Canvas | Artboard>(parentRecordKey)!;

        const xLength = offsetX - ((parentRecord as Artboard).x ?? 0);
        const yLength = offsetY - ((parentRecord as Artboard).y ?? 0);

        const record = (() => {
          if (isDrawingArtboard) {
            return new Artboard(makeDefaultArtboardArgs('New artboard', xLength, yLength));
          }
          if (isDrawingShape) {
            return new ShapeLayer(makeDefaultShapeLayerArgs('New shape', xLength, yLength));
          }
        })();

        uiController.select([]);

        if (record == null) {
          break;
        }

        uiController.append(parentRecordKey, record, { saveDraft: true });

        const enter = () => {
          uiController.select([record.key]);
        };
        const leave = () => {
          uiController.flushDrafts();
          uiController.toggleMode(UIDesignToolMode.select);
        };
        const clear = () => {
          uiController.remove(record.key);
        };
        waitingQueue.push({ event, target: record.key, status: nextStatus, enter, leave, clear, calibrate: 5 });

        break;
      }

      /** @todo TextLayer 추가 및 수정 기능 구현 */
      // case UIDesignToolInteractionType.input: {
      //   const record = new TextLayer(makeDefaultTextLayerArgs('New text', xLength, yLength));
      //   uiController.append(parentRecordKey, record);
      //   uiController.select([record.key]);
      //   waitingQueue.push({ event, target: record.key, status: nextStatus, calibrate: 5 });
      //   break;
      // }

      case UIDesignToolInteractionType.transform: {
        const transformMethod: Exclude<UIDesignToolTransformMethod, 'unable'> =
          handleType == null || handleType === InteractionHandleType.select ? UIDesignToolTransformMethod.move : handleType;

        const recordKeys: UIRecordKey[] =
          transformMethod === UIDesignToolTransformMethod.move
            ? isUIRecordKey(hoveredRecordKey)
              ? [hoveredRecordKey]
              : []
            : [...selectedRecordKeys];

        if (transformMethod === UIDesignToolTransformMethod.move) {
          /** @todo 다중 선택 기능 구현 후 조건 추가  */
          uiController.select(recordKeys);
        }

        waitingQueue.push({ event, target: recordKeys[0], status: nextStatus, calibrate: 5 });

        break;
      }

      default: {
        uiController.select([]);

        break;
      }
    }
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    waitingQueue.forEach((it) => it.clear?.());
    waitingQueue.length = 0;
    setStatus(UIDesignToolStatus.idle);
    interactEnd(event, currentStatus);
    inProgressQueue.forEach((it) => it.leave?.());
    inProgressQueue.length = 0;
  });

  const onDocumentMouseMove = useEvent((event: MouseEvent) => {
    const task = waitingQueue.shift();

    if (task != null) {
      const movementRange = Math.abs(task.event.clientX - event.clientX) + Math.abs(task.event.clientY - event.clientY);

      // 마우스가 `calibrate` 이상 움직이지 않은 경우 인터랙션을 시작하지 않음 (사용자가 단순히 무언가를 클릭할 때 마우스가 밀리는 것을 보정)
      if (movementRange < (task.calibrate ?? 0)) {
        return waitingQueue.unshift(task);
      }

      setStatus(task.status);
      task.enter?.();
      interactStart(task.event, task.status, task.target);
      return inProgressQueue.push(task);
    }

    interactInProgress(event, currentStatus);
  });

  return { onDocumentMouseDown, onDocumentMouseUp, onDocumentMouseMove };
}
