import React from 'react';
import { TransformOverlayRenderer } from './TransformOverlayRenderer';
import { TransformOverlayProps } from './types';
import useData from './useData';
import useResizeHandlers from './useResizeHandlers';
import useRotateHandlers from './useRotateHandlers';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const TransformOverlay: React.FC<TransformOverlayProps> = React.memo(() => {
  const data = useData();
  const { selectedRecordKey } = data;

  /** @todo InteractionController에서 중앙 관리 하도록 이벤트 핸들러 이관 (핸들 엘리먼트에 적절한 식별자 제공) */
  const { onResizeHandleMouseDown, onDocumentMouseUpForResize, onDocumentMouseMoveForResize, onDocuemntKeyDownUpForResize } =
    useResizeHandlers({ data });

  /** @todo InteractionController에서 중앙 관리 하도록 이벤트 핸들러 이관 (핸들 엘리먼트에 적절한 식별자 제공) */
  const { onRotateHandleMouseDown, onDocumentMouseUpForRotate, onDocumentMouseMoveForRotate } = useRotateHandlers({ data });

  return (
    <TransformOverlayRenderer
      recordKey={selectedRecordKey}
      onResizeHandleMouseDown={onResizeHandleMouseDown}
      onDocumentMouseUpForResize={onDocumentMouseUpForResize}
      onDocumentMouseMoveForResize={onDocumentMouseMoveForResize}
      onDocuemntKeyDownUpForResize={onDocuemntKeyDownUpForResize}
      onRotateHandleMouseDown={onRotateHandleMouseDown}
      onDocumentMouseUpForRotate={onDocumentMouseUpForRotate}
      onDocumentMouseMoveForRotate={onDocumentMouseMoveForRotate}
    />
  );
});
TransformOverlay.displayName = 'TransformOverlay';
