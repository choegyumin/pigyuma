import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import { InteractionType, TransformMethod, UIDesignToolMode } from '@/api/UIDesignTool';
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
} from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import React, { useCallback, useMemo } from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { HoveringOverlay } from '../HoveringOverlay/HoveringOverlay';
import { PointerEventsController } from '../PointerEventsController/PointerEventsController';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import { StatusAction } from '../UIDesignToolProvider/useContextValues';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';
import useMoveFunctions from './useMoveFunctions';
import useResizeFunctions from './useResizeFunctions';
import useRotateFunctions from './useRotateFunctions';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const InteractionController: React.FC<InteractionControllerProps> = React.memo(() => {
  const uiController = useUIController();
  const uiSelector = useUISelector();

  const mode = useMode();
  const status = useStatus();
  const hoveredRecordKey = useHovered();
  /** @todo 다중 선택 기능 구현 후 코드 변경  */
  const selectedRecordKey = [...useSelected()][0] as UIRecordKey | undefined;
  const getItemReference = useItemReference();

  const { setHovered, setStatus } = useDispatcher();

  const { startMove, move, endMove } = useMoveFunctions(selectedRecordKey);
  const { startResize, resize, endResize } = useResizeFunctions(selectedRecordKey);
  const { startRotate, rotate, endRotate } = useRotateFunctions(selectedRecordKey);

  const interactionQueue = useMemo<Array<{ event: MouseEvent; action: StatusAction; calibrate: number }>>(() => [], []);

  const startInteraction = useCallback(
    (event: MouseEvent, action: StatusAction) => {
      if (action.interactionType === InteractionType.selection) {
        // startSelection(event);
      } else if (action.interactionType === InteractionType.drawing) {
        // startDrawing(event);
      } else if (action.interactionType === InteractionType.transform) {
        if (action.transformMethod === TransformMethod.move) {
          startMove(event);
        } else if (action.transformMethod === TransformMethod.resize) {
          startResize(event);
        } else if (action.transformMethod === TransformMethod.rotate) {
          startRotate(event);
        }
      }
    },
    [startMove, startResize, startRotate],
  );

  const endInteraction = useCallback(
    (event: MouseEvent, action: StatusAction) => {
      if (action.interactionType === InteractionType.selection) {
        // endSelection(event);
      } else if (action.interactionType === InteractionType.drawing) {
        // endDrawing(event);
      } else if (action.interactionType === InteractionType.transform) {
        if (action.transformMethod === TransformMethod.move) {
          endMove(event);
        } else if (action.transformMethod === TransformMethod.resize) {
          endResize(event);
        } else if (action.transformMethod === TransformMethod.rotate) {
          endRotate(event);
        }
      }
    },
    [endMove, endResize, endRotate],
  );

  const progressInteraction = useCallback(
    (event: MouseEvent, action: StatusAction) => {
      if (action.interactionType === InteractionType.selection) {
        // selection(event);
      } else if (action.interactionType === InteractionType.drawing) {
        // drawing(event);
      } else if (action.interactionType === InteractionType.transform) {
        if (action.transformMethod === TransformMethod.move) {
          move(event);
        } else if (action.transformMethod === TransformMethod.resize) {
          resize(event);
        } else if (action.transformMethod === TransformMethod.rotate) {
          rotate(event);
        }
      }
    },
    [move, resize, rotate],
  );

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolElementDataAttributeName.id}]`))) {
      return;
    }

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);

    /** @todo 데이터로 판단하는 대신 `fromMouse`처럼 overlay를 반환하는 메서드를 추가해 선택 영역을 클릭하면 true를 지정하도록 변경 (overlay가 바닥을 덮도록 함) */
    const isSelectionGrabbing = isUIRecordKey(hoveredRecordKey);
    const isHandleGrabbing = handle != null;

    const interactionType: InteractionType = (() => {
      if (mode === UIDesignToolMode.select) {
        if (isSelectionGrabbing || isHandleGrabbing) {
          return InteractionType.transform;
        }
        return InteractionType.selection;
      }
      if (mode === UIDesignToolMode.artboard || mode === UIDesignToolMode.shape || mode === UIDesignToolMode.text) {
        return InteractionType.drawing;
      }
      return InteractionType.idle;
    })();

    switch (interactionType) {
      case InteractionType.selection:
      case InteractionType.drawing: {
        interactionQueue.push({
          event,
          action: { interactionType },
          calibrate: 0,
        });

        uiController.select([]);
        break;
      }

      case InteractionType.transform: {
        const transformMethod =
          (handle?.dataset[UIInteractionElementDataset.handleType] as Exclude<TransformMethod, 'none'> | undefined) ?? TransformMethod.move;

        interactionQueue.push({
          event,
          action: { interactionType, transformMethod },
          calibrate: 5,
        });

        if (!isHandleGrabbing) {
          /** @todo 다중 선택 기능 구현 후 조건 추가  */
          uiController.select(isUIRecordKey(hoveredRecordKey) ? [hoveredRecordKey] : []);
        }
        break;
      }

      default: {
        uiController.select([]);
        break;
      }
    }
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    // Flush
    interactionQueue.length = 0;
    setStatus({ interactionType: InteractionType.idle });
    endInteraction(event, status);
  });

  const onDocumentMouseMove = useEvent((event: MouseEvent) => {
    const interactionItem = interactionQueue.shift();

    if (interactionItem != null) {
      const movementRange =
        Math.abs(interactionItem.event.clientX - event.clientX) + Math.abs(interactionItem.event.clientY - event.clientY);

      // 마우스가 `calibrate` 이상 움직이지 않은 경우 인터랙션을 시작하지 않음 (사용자가 단순히 무언가를 클릭할 때 마우스가 밀리는 것을 보정)
      if (movementRange < interactionItem.calibrate) {
        return interactionQueue.unshift(interactionItem);
      }

      setStatus(interactionItem.action);
      return startInteraction(interactionItem.event, interactionItem.action);
    }

    if (status.interactionType === InteractionType.idle) {
      const target = uiSelector.fromMouse();
      const recordKey = target != null ? uiSelector.dataset(target).key : undefined;
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

      const isSelectableRecord = record instanceof Artboard || record instanceof Layer;

      setHovered(isSelectableRecord ? record.key : undefined);
    } else {
      progressInteraction(event, status);
    }
  });

  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mouseup', onDocumentMouseUp);
  useEventListener(document, 'mousemove', onDocumentMouseMove);

  return (
    <div className={styles.root}>
      <AxisGrid />
      <HoveringOverlay />
      <SelectionOverlay />
      <PointerEventsController />
    </div>
  );
});
InteractionController.displayName = 'InteractionController';
