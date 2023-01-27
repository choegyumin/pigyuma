import { CanvasKey } from '@/types/Identifier';
import { cloneDeep } from '@pigyuma/utils';
import clsx from 'clsx';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { CanvasComponent } from '../Canvas/Canvas.component';
import { Canvas } from '../Canvas/Canvas.model';
import { InteractionController } from '../InteractionController/InteractionController.component';
import { UIDesignToolAPIProvider } from '../UIDesignToolAPIProvider/UIDesignToolAPIProvider.component';
import { WorkspaceProps, WorkspaceRef } from './types';
import { WorkspaceContextProvider, UIDesignToolAPI } from './Workspace.context';
import * as styles from './Workspace.css';

export const WorkspaceComponent = React.forwardRef<WorkspaceRef, WorkspaceProps>((props, ref) => {
  const { initialData: data, ...attrs } = props;

  const apiRef = useRef<UIDesignToolAPI>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const [initialData] = useState(
    () =>
      new Canvas({
        children: cloneDeep(data),
      }),
  );

  useImperativeHandle(
    ref,
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      api: apiRef.current!,
      element: elementRef.current,
    }),
    [],
  );

  return (
    <WorkspaceContextProvider canvas={initialData} elementRef={elementRef}>
      <UIDesignToolAPIProvider ref={apiRef} />
      <div {...attrs} ref={elementRef} className={clsx(styles.root, attrs.className)}>
        <CanvasComponent dataKey={CanvasKey} />
        <InteractionController />
      </div>
    </WorkspaceContextProvider>
  );
});
WorkspaceComponent.displayName = 'Workspace';
