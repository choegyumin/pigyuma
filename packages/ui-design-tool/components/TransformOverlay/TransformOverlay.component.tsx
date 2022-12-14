import React from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import { TransformOverlayRenderer } from './TransformOverlayRenderer.component';
import { TransformOverlayProps } from './types';
import useData from './useData';
import useResizeHandlers from './useResizeHandlers';
import useRotateHandlers from './useRotateHandlers';

export const TransformOverlay: React.FC<TransformOverlayProps> = React.memo(() => {
  const context = useContextForInteraction();

  const data = useData({ context });
  const { selectedRecordKey } = data;

  const { onResizeHandleMouseDown, onDocumentMouseUpForResize, onDocumentMouseMoveForResize, onDocuemntKeyDownUpForResize } =
    useResizeHandlers({ context, data });
  const { onRotateHandleMouseDown, onDocumentMouseUpForRotate, onDocumentMouseMoveForRotate } = useRotateHandlers({ context, data });

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
