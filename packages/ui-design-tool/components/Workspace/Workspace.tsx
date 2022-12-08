import clsx from 'clsx';
import React from 'react';
import { WorkspaceProps } from './types';
import styles from './Workspace.css';

const Workspace: React.FC<WorkspaceProps> = (props) => {
  return <div data-ui-design-tool-name="workspace" className={clsx(styles.root, props.className)} />;
};
Workspace.displayName = 'Workspace';

export default Workspace;
