import React from 'react';
import { TransformOverlayRenderer } from './TransformOverlayRenderer';
import { TransformOverlayProps } from './types';
import useData from './useData';
import useResizeHandlers from './useResizeHandlers';
import useRotateHandlers from './useRotateHandlers';

/** @todo (설계가 일정 수준 이상 확정되면) 테스트 코드 작성 */
export const TransformOverlay: React.FC<TransformOverlayProps> = React.memo(() => {
  const data = useData();
  const { selectedRecordKey } = data;

  const { onResizeHandleMouseDown, onDocumentMouseUpForResize, onDocumentMouseMoveForResize, onDocuemntKeyDownUpForResize } =
    useResizeHandlers({ data });
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
