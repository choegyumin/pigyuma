import clsx from 'clsx';
import React from 'react';
import * as styles from './AxisGrid.css';
import useAxisGrid from './useAxisGrid';

export const AxisGrid: React.FC = React.memo(() => {
  const viewModel = useAxisGrid();
  if (viewModel == null) {
    return null;
  }

  const { rootStyle } = viewModel;

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={clsx(styles.axis, styles.axis_direction.x)} />
      <div className={clsx(styles.axis, styles.axis_direction.y)} />
    </div>
  );
});
AxisGrid.displayName = 'AxisGrid';
