import { StatusType } from '@/api/UIDesignTool';
import useSelected from '@/hooks/useSelected';
import useStatus from '@/hooks/useStatus';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import clsx from 'clsx';
import React from 'react';
import * as styles from './AxisGrid.css';
import useRenderUtils from './useRenderUtils';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const AxisGrid: React.FC = React.memo(() => {
  const status = useStatus();
  const selected = useSelected();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle } = useRenderUtils();

  const isActive = record != null && selected.size === 1 && status.statusType === StatusType.idle;

  if (!isActive) {
    return null;
  }

  const rootStyle = getRootStyle(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={clsx(styles.axis, styles.axis$.x)} />
      <div className={clsx(styles.axis, styles.axis$.y)} />
    </div>
  );
});
AxisGrid.displayName = 'AxisGrid';
