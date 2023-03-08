import { Box } from '@pigyuma/design-system/patterns';
import { UIDesignCanvas } from '@pigyuma/ui-design-tool';
import clsx from 'clsx';
import React from 'react';
import ControlPanel from '~/components/ControlPanel';
import ExplorePanel from '~/components/ExplorePanel';
import NoSSR from '~/components/NoSSR';
import WorkspaceToolbar from '~/components/WorkspaceToolbar';
import { WorkspaceProps, WorkspaceRef } from './types';
import * as styles from './Workspace.css';

const Workspace = React.memo(
  React.forwardRef<WorkspaceRef, WorkspaceProps>((props, ref) => {
    const { initialData, ...restProps } = props;

    return (
      <Box as="div" {...restProps} ref={ref} className={clsx(styles.root, props.className)}>
        <WorkspaceToolbar />
        <div className={styles.container}>
          <NoSSR>
            <UIDesignCanvas initialData={initialData} />
            <ExplorePanel />
            <ControlPanel />
          </NoSSR>
        </div>
      </Box>
    );
  }),
);
Workspace.displayName = 'Workspace';

export default Workspace;
