import React from 'react';
import { SelectionOverlayRenderer } from './SelectionOverlayRenderer';
import { SelectionOverlayProps } from './types';
import useData from './useData';
import useHandlers from './useHandlers';

/**
 * @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성
 * @todo SelectionOverlay와 RangeSelectionOverlay 분리
 */
export const SelectionOverlay: React.FC<SelectionOverlayProps> = React.memo(() => {
  const data = useData();
  const { hoveredRecordKey } = data;

  /** @todo InteractionController에서 중앙 관리 하도록 이벤트 핸들러 이관 (핸들 엘리먼트에 적절한 식별자 제공) */
  const { onDocumentMouseMove, onDocumentMouseDown, onDocumentMouseUp } = useHandlers({ data });

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
