import clsx from 'clsx';
import React, { useMemo } from 'react';
import { CanvasComponent } from '../Canvas/Canvas.component';
import { Canvas } from '../Canvas/Canvas.model';
import { EventControllerComponent } from '../EventController/EventController.component';
import { WorkspaceProps, WorkspaceRef } from './types';
import * as styles from './Workspace.css';

export const WorkspaceComponent = React.forwardRef<WorkspaceRef, WorkspaceProps>((props, ref) => {
  const { data: records, ...attrs } = props;

  const canvas = useMemo(
    () =>
      new Canvas({
        children: records,
      }),
    [records],
  );

  return (
    <div {...attrs} data-ui-design-tool-name="workspace" ref={ref} className={clsx(styles.root, attrs.className)}>
      <CanvasComponent canvas={canvas} />
      <EventControllerComponent />
    </div>
  );
});
WorkspaceComponent.displayName = 'Workspace';
