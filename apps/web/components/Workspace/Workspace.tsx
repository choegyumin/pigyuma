import { Box } from '@pigyuma/react-utils';
import { UIDesignCanvas } from '@pigyuma/ui-design-tool';
import clsx from 'clsx';
import React from 'react';
import ControlPanel from '~/components/ControlPanel';
import ExplorePanel from '~/components/ExplorePanel';
import NoSSR from '~/components/NoSSR';
import WorkspaceToolbar from '~/components/WorkspaceToolbar';
import { WorkspaceElementType, WorkspaceProps, WorkspaceRefInstance } from './types';
import * as styles from './Workspace.css';

const Workspace = React.memo(
  React.forwardRef<WorkspaceRefInstance, WorkspaceProps>((props, ref) => {
    const { initialData, className, ...restProps } = props;

    return (
      <Box {...restProps} ref={ref} as={WorkspaceElementType} className={clsx(styles.root, className)}>
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
