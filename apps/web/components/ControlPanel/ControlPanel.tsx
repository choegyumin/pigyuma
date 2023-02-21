import clsx from 'clsx';
import React from 'react';
import Panel from '../Panel';
import * as styles from './ControlPanel.css';
import { ControlPanelProps, ControlPanelRef } from './types';

const ControlPanel = React.forwardRef<ControlPanelRef, ControlPanelProps>((props, ref) => {
  return (
    <Panel {...props} ref={ref} as="div" role="toolbar" className={clsx(styles.root, props.className)} placement="right">
      {props.children}
    </Panel>
  );
});
ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
