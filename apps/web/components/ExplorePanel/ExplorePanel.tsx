import clsx from 'clsx';
import React from 'react';
import LayerTreeSection from '../LayerTreeSection';
import Panel from '../Panel';
import * as styles from './ExplorePanel.css';
import { ExplorePanelElementType, ExplorePanelProps, ExplorePanelRefInstance } from './types';

const ExplorePanel = React.forwardRef<ExplorePanelRefInstance, ExplorePanelProps>((props, ref) => {
  return (
    <Panel
      role="navigation"
      {...props}
      ref={ref}
      as={ExplorePanelElementType}
      className={clsx(styles.root, props.className)}
      placement="left"
    >
      <LayerTreeSection />
    </Panel>
  );
});
ExplorePanel.displayName = 'ExplorePanel';

export default ExplorePanel;
