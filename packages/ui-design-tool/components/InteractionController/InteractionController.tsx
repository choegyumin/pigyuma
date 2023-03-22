import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import { StatusType, TransformMethod } from '@/api/UIDesignTool';
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
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { HoveringOverlay } from '../HoveringOverlay/HoveringOverlay';
import { PointerEventsController } from '../PointerEventsController/PointerEventsController';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';
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

  const { startResize, resize, endResize } = useResizeFunctions(selectedRecordKey);
  const { startRotate, rotate, endRotate } = useRotateFunctions(selectedRecordKey);

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolElementDataAttributeName.id}]`))) {
      return;
    }

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);

    /** @todo 데이터로 판단하는 대신 `fromMouse`처럼 overlay를 반환하는 메서드를 추가해 선택 영역을 클릭하면 true를 지정하도록 변경 (overlay가 바닥을 덮도록 함) */
    const isSelectionGrabbing = isUIRecordKey(hoveredRecordKey);
    const isHandleGrabbing = handle != null;

    const shouldTransform = isSelectionGrabbing || isHandleGrabbing;
    const shouldSelection = !shouldTransform;

    if (shouldSelection) {
      setStatus({ statusType: StatusType.selection });
      uiControllerAPI.select([]);

      // return startSelection(event);
      return;
    }

    if (shouldTransform) {
      const transformMethod =
        (handle?.dataset[UIInteractionElementDataset.handleType] as Exclude<TransformMethod, 'none'> | undefined) ?? TransformMethod.move;
      setStatus({ statusType: StatusType.transform, transformMethod });
      if (!isHandleGrabbing) {
        /** @todo 다중 선택 기능 구현 후 조건 추가  */
        uiControllerAPI.select(isUIRecordKey(hoveredRecordKey) ? [hoveredRecordKey] : []);
      }

      // if (transformMethod === TransformMethod.move) {
      //   return startMove(event);
      // }

      if (transformMethod === TransformMethod.resize) {
        return startResize(event);
      }

      if (transformMethod === TransformMethod.rotate) {
        return startRotate(event);
      }

      return;
    }

    uiControllerAPI.select([]);
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    setStatus({ statusType: StatusType.idle });

    // if (status.statusType === StatusType.selection) {
    //   return endSelection(event);
    // }

    if (status.statusType === StatusType.transform) {
      // if (status.transformMethod === TransformMethod.move) {
      //   return endMove(event);
      // }

      if (status.transformMethod === TransformMethod.resize) {
        return endResize(event);
      }

      if (status.transformMethod === TransformMethod.rotate) {
        return endRotate(event);
      }
    }
  });

  const onDocumentMouseMove = useEvent((event: MouseEvent) => {
    console.log({ ...status, hovered: hoveredRecordKey, selected: selectedRecordKey });

    if (status.statusType === StatusType.idle) {
      const target = uiSelectorAPI.fromMouse();
      const recordKey = target != null ? uiSelectorAPI.dataset(target).key : undefined;
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

      const isSelectableRecord = record instanceof Artboard || record instanceof Layer;

      setHovered(isSelectableRecord ? record.key : undefined);
      return;
    }

    // if (status.statusType === StatusType.selection) {
    //   return selection(event);
    // }

    if (status.statusType === StatusType.transform) {
      // if (status.transformMethod === TransformMethod.move) {
      //   return move(event);
      // }

      if (status.transformMethod === TransformMethod.resize) {
        return resize(event);
      }

      if (status.transformMethod === TransformMethod.rotate) {
        return rotate(event);
      }

      return;
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
