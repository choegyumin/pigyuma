import useDrafts from '@/hooks/useDrafts';
import useSelected from '@/hooks/useSelected';
import useStatusMetadata from '@/hooks/useStatusMetadata';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { UIDesignToolInteractionType } from '@/types/Status';
import clsx from 'clsx';
import React from 'react';
import * as styles from './AxisGrid.css';
import useRenderUtils from './useRenderUtils';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const AxisGrid: React.FC = React.memo(() => {
  const statusMetadata = useStatusMetadata();
  const selected = useSelected();
  const drafts = useDrafts();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle } = useRenderUtils();

  const isActive =
    record != null &&
    selected.size === 1 &&
    !drafts.has(record?.key) &&
    statusMetadata.interactionType === UIDesignToolInteractionType.idle;

  if (!isActive) {
    return null;
  }

  const rootStyle = getRootStyle(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={clsx(styles.axis, styles.axis_direction.x)} />
      <div className={clsx(styles.axis, styles.axis_direction.y)} />
    </div>
  );
});
AxisGrid.displayName = 'AxisGrid';
