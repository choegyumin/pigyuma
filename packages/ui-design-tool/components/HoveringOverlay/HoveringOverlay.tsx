import React from 'react';
import * as styles from './HoveringOverlay.css';
import useHoveringOverlay from './useHoveringOverlay';

/** @todo HoveringOverlay와 RangeHoveringOverlay 분리 */
export const HoveringOverlay: React.FC = React.memo(() => {
  const viewModel = useHoveringOverlay();
  if (viewModel == null) {
    return null;
  }

  const { rootStyle } = viewModel;

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.outline} />
    </div>
  );
});
HoveringOverlay.displayName = 'HoveringOverlay';
