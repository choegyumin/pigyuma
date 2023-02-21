import clsx from 'clsx';
import React from 'react';
import Toolbar from '../Toolbar';
import { WorkspaceToolbarProps, WorkspaceToolbarRef } from './types';
import * as styles from './WorkspaceToolbar.css';

const WorkspaceToolbar = React.forwardRef<WorkspaceToolbarRef, WorkspaceToolbarProps>((props, ref) => {
  return (
    <Toolbar {...props} ref={ref} className={clsx(styles.root, props.className)}>
      {props.children}
    </Toolbar>
  );
});
WorkspaceToolbar.displayName = 'WorkspaceToolbar';

export default WorkspaceToolbar;
