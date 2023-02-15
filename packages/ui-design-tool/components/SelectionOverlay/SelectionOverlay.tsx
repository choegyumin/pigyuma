import { useUIDesignToolAPI } from '@/hooks';
import React from 'react';
import { SelectionOverlayRenderer } from './SelectionOverlayRenderer';
import { SelectionOverlayProps } from './types';
import useData from './useData';
import useHandlers from './useHandlers';

/**
 * @todo (설계가 일정 수준 이상 확정되면) 테스트 코드 작성
 * @todo SelectionOverlay와 RangeSelectionOverlay 분리
 */
export const SelectionOverlay: React.FC<SelectionOverlayProps> = React.memo(() => {
  const api = useUIDesignToolAPI();

  const data = useData({ api });
  const { hoveredRecordKey } = data;

  const { onDocumentMouseMove, onDocumentMouseDown, onDocumentMouseUp } = useHandlers({ api, data });

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
