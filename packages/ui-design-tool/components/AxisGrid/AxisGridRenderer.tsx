import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import clsx from 'clsx';
import React from 'react';
import * as styles from './AxisGrid.css';
import { AxisGridRendererProps } from './types';
import useRenderUtils from './useRenderUtils';

export const AxisGridRenderer: React.FC<AxisGridRendererProps> = (props) => {
  const { recordKey } = props;
  const record = useUIRecordForInteraction(recordKey);

  const { getRootStyle } = useRenderUtils();

  if (record == null) {
    return null;
  }

  const rootStyle = getRootStyle(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={clsx(styles.axis, styles.axis$.x)} />
      <div className={clsx(styles.axis, styles.axis$.y)} />
    </div>
  );
};
AxisGridRenderer.displayName = 'AxisGridRenderer';
