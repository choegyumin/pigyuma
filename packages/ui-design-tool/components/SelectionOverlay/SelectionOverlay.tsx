import { StatusType } from '@/api/UIDesignTool';
import useHovered from '@/hooks/useHovered';
import useStatus from '@/hooks/useStatus';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import React from 'react';
import * as styles from './SelectionOverlay.css';
import useRenderUtils from './useRenderUtils';

/**
 * @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성
 * @todo SelectionOverlay와 RangeSelectionOverlay 분리
 */
export const SelectionOverlay: React.FC = React.memo(() => {
  const status = useStatus();
  const hovered = useHovered();

  const record = useUIRecordForInteraction(hovered);

  const { getRootStyle } = useRenderUtils();

  const isActive = record != null && status.statusType === StatusType.idle;

  if (!isActive) {
    return null;
  }

  const rootStyle = getRootStyle(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.outline} />
    </div>
  );
});
SelectionOverlay.displayName = 'SelectionOverlay';
