import React from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import { SelectionOverlayRenderer } from './SelectionOverlayRenderer.component';
import { SelectionOverlayProps } from './types';
import useData from './useData';
import useHandlers from './useHandlers';

export const SelectionOverlay: React.FC<SelectionOverlayProps> = React.memo(() => {
  const context = useContextForInteraction();

  const data = useData({ context });
  const { hoveredRecordKey } = data;

  const { onDocumentMouseMove, onDocumentMouseDown, onDocumentMouseUp } = useHandlers({ context, data });

  return (
    <SelectionOverlayRenderer
      /** @todo Range selection 기능 구현 (`{ recordKeys: UIRecordKey[] }` 타입으로 변경) */
      recordKey={hoveredRecordKey}
      onDocumentMouseMove={onDocumentMouseMove}
      onDocumentMouseDown={onDocumentMouseDown}
      onDocumentMouseUp={onDocumentMouseUp}
    />
  );
});
SelectionOverlay.displayName = 'SelectionOverlay';
