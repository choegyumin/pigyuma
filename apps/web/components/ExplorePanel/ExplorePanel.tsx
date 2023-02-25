import clsx from 'clsx';
import React from 'react';
import LayerTreeSection from '../LayerTreeSection';
import Panel from '../Panel';
import * as styles from './ExplorePanel.css';
import { ExplorePanelProps, ExplorePanelRef } from './types';

const ExplorePanel = React.forwardRef<ExplorePanelRef, ExplorePanelProps>((props, ref) => {
  return (
    <Panel {...props} ref={ref} as="nav" role="navigation" className={clsx(styles.root, props.className)} placement="left">
      <LayerTreeSection />
    </Panel>
  );
});
ExplorePanel.displayName = 'ExplorePanel';

export default ExplorePanel;
