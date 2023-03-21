import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import { InteractionType, TransformMethod } from '@/api/UIDesignTool';
import useDispatcher from '@/hooks/useDispatcher';
import useHovered from '@/hooks/useHovered';
import useItemReference from '@/hooks/useItemReference';
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
import { setRef, useEvent, useEventListener } from '@pigyuma/react-utils';
import React, { useRef } from 'react';
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
  const uiControllerAPI = useUIController();
  const uiSelectorAPI = useUISelector();

  const status = useStatus();
  const hoveredRecordKey = useHovered();
  /** @todo 다중 선택 기능 구현 후 코드 변경  */
  const selectedRecordKey = [...useSelected()][0] as UIRecordKey | undefined;
  const getItemReference = useItemReference();

  const { setHovered, setStatus } = useDispatcher();

  const { startMove, move, endMove } = useMoveFunctions(selectedRecordKey);
  const { startResize, resize, endResize } = useResizeFunctions(selectedRecordKey);
  const { startRotate, rotate, endRotate } = useRotateFunctions(selectedRecordKey);

  const nextStatusActionQueue = useRef<StatusAction[]>([]);

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolElementDataAttributeName.id}]`))) {
      return;
    }

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);

    /** @todo 데이터로 판단하는 대신 `fromMouse`처럼 overlay를 반환하는 메서드를 추가해 선택 영역을 클릭하면 true를 지정하도록 변경 (overlay가 바닥을 덮도록 함) */
    const isSelectionGrabbing = isUIRecordKey(hoveredRecordKey);
    const isHandleGrabbing = handle != null;

    const interactionType = isSelectionGrabbing || isHandleGrabbing ? InteractionType.transform : InteractionType.selection;

    if (interactionType === InteractionType.selection) {
      nextStatusActionQueue.current.push({ interactionType: InteractionType.selection });

      uiControllerAPI.select([]);
    } else if (interactionType === InteractionType.transform) {
      const transformMethod =
        (handle?.dataset[UIInteractionElementDataset.handleType] as Exclude<TransformMethod, 'none'> | undefined) ?? TransformMethod.move;

      nextStatusActionQueue.current.push({ interactionType: InteractionType.transform, transformMethod });

      if (!isHandleGrabbing) {
        /** @todo 다중 선택 기능 구현 후 조건 추가  */
        uiControllerAPI.select(isUIRecordKey(hoveredRecordKey) ? [hoveredRecordKey] : []);
      }
    } else {
      uiControllerAPI.select([]);
    }
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    // Flush
    setRef(nextStatusActionQueue, []);
    setStatus({ interactionType: InteractionType.idle });

    if (status.interactionType === InteractionType.selection) {
      // endSelection(event);
    } else if (status.interactionType === InteractionType.transform) {
      if (status.transformMethod === TransformMethod.move) {
        endMove(event);
      } else if (status.transformMethod === TransformMethod.resize) {
        endResize(event);
      } else if (status.transformMethod === TransformMethod.rotate) {
        endRotate(event);
      }
    }
  });

  const onDocumentMouseMove = useEvent((event: MouseEvent) => {
    // console.log({ ...status, hovered: hoveredRecordKey, selected: selectedRecordKey });

    const statusAction = nextStatusActionQueue.current.shift();

    if (statusAction != null) {
      if (statusAction.interactionType === InteractionType.selection) {
        // startSelection(event);
      } else if (statusAction.interactionType === InteractionType.transform) {
        if (statusAction.transformMethod === TransformMethod.move) {
          startMove(event);
        } else if (statusAction.transformMethod === TransformMethod.resize) {
          startResize(event);
        } else if (statusAction.transformMethod === TransformMethod.rotate) {
          startRotate(event);
        }
      }
      return setStatus(statusAction);
    }

    if (status.interactionType === InteractionType.idle) {
      const target = uiSelectorAPI.fromMouse();
      const recordKey = target != null ? uiSelectorAPI.dataset(target).key : undefined;
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

      const isSelectableRecord = record instanceof Artboard || record instanceof Layer;

      setHovered(isSelectableRecord ? record.key : undefined);
    } else if (status.interactionType === InteractionType.selection) {
      // selection(event);
    } else if (status.interactionType === InteractionType.transform) {
      if (status.transformMethod === TransformMethod.move) {
        move(event);
      } else if (status.transformMethod === TransformMethod.resize) {
        resize(event);
      } else if (status.transformMethod === TransformMethod.rotate) {
        rotate(event);
      }
    }
  });

  useEventListener(document, 'mousedown', onDocumentMouseDown);
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
