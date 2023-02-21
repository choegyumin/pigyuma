import { CanvasComponent } from '@/api/Canvas/component';
import { useUIController } from '@/hooks';
import { CanvasKey } from '@/types/Identifier';
import { useMount } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import { InteractionController } from '../InteractionController/InteractionController';
import { WorkspaceProps, WorkspaceRef } from './types';
import * as styles from './Workspace.css';

export const WorkspaceComponent = React.memo(
  React.forwardRef<WorkspaceRef, WorkspaceProps>((props, ref) => {
    const { reset } = useUIController();
    const { initialData, ...attrs } = props;

    useMount(() => {
      reset(cloneDeep(initialData));
    });

    return (
      <div {...attrs} ref={ref} className={clsx(styles.root, attrs.className)}>
        <CanvasComponent dataKey={CanvasKey} />
        <InteractionController />
      </div>
    );
  }),
);
WorkspaceComponent.displayName = 'Workspace';
