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
import { UIInteractionElementDataAttributeName, UIInteractionElementDataset } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { PointerEventsPreventer } from '../PointerEventsPreventer/PointerEventsPreventer';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import { TransformOverlay } from '../TransformOverlay/TransformOverlay';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const InteractionController: React.FC<InteractionControllerProps> = React.memo(() => {
  const uiControllerAPI = useUIController();
  const uiSelectorAPI = useUISelector();

  const status = useStatus();
  const hovered = useHovered();
  const selected = useSelected();
  const getItemReference = useItemReference();

  const { setStatus, setHovered } = useDispatcher();

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);

    /** @todo 데이터로 판단하는 대신 `fromMouse`처럼 overlay를 반환하는 메서드를 추가해 선택 영역을 클릭하면 true를 지정하도록 변경 (overlay가 바닥을 덮도록 함) */
    const isSelectionGrabbing = isUIRecordKey(hovered);
    const isHandleGrabbing = handle != null;

    const shouldTransform = isSelectionGrabbing || isHandleGrabbing;
    const shouldSelection = !shouldTransform;

    if (shouldSelection) {
      setStatus({ statusType: StatusType.selection });
      uiControllerAPI.select([]);
      return;
    }

    if (shouldTransform) {
      const handleType =
        (handle?.dataset[UIInteractionElementDataset.handleType] as Exclude<TransformMethod, 'none'> | undefined) ?? TransformMethod.move;
      setStatus({ statusType: StatusType.transform, transformMethod: handleType });
      /** @todo 다중 선택 기능 구현 후 조건 추가  */
      uiControllerAPI.select(isUIRecordKey(hovered) ? [hovered] : []);
      return;
    }

    uiControllerAPI.select([]);
  });

  const onDocumentMouseUp = useEvent(() => {
    setStatus({ statusType: StatusType.idle });
  });

  const onDocumentMouseMove = useEvent(() => {
    console.log({ ...status, hovered, selected: [...selected] });

    if (status.statusType === StatusType.idle) {
      const target = uiSelectorAPI.fromMouse();
      const recordKey = target != null ? uiSelectorAPI.dataset(target).key : undefined;
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

      const isSelectableRecord = record instanceof Artboard || record instanceof Layer;

      setHovered(isSelectableRecord ? record.key : undefined);
      return;
    }

    // if (status.statusType === StatusType.selection) {}

    // if (status.statusType === StatusType.transform) {}
  });

  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mouseup', onDocumentMouseUp);
  useEventListener(document, 'mousemove', onDocumentMouseMove);

  return (
    <div className={styles.root}>
      <AxisGrid />
      <SelectionOverlay />
      <TransformOverlay />
      <PointerEventsPreventer />
    </div>
  );
});
InteractionController.displayName = 'InteractionController';
