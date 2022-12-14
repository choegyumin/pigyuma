import { CanvasKey } from '@/types/Identifier';
import { cloneDeep } from '@pigyuma/utils';
import clsx from 'clsx';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { CanvasComponent } from '../Canvas/Canvas.component';
import { Canvas } from '../Canvas/Canvas.model';
import { EventControllerComponent } from '../EventController/EventController.component';
import { WorkspaceProps, WorkspaceRef } from './types';
import useUIRecordAPI from './useUIRecordAPI';
import { WorkspaceContext } from './Workspace.context';
import * as styles from './Workspace.css';

export const WorkspaceComponent = React.forwardRef<WorkspaceRef, WorkspaceProps>((props, ref) => {
  const { initialData: data, ...attrs } = props;

  const elementRef = useRef<HTMLDivElement>(null);

  const [initialData] = useState(
    () =>
      new Canvas({
        children: cloneDeep(data),
      }),
  );

  const { records, append, prepend, insert, set, remove, listeners, subscribe, unsubscribe } = useUIRecordAPI(initialData);

  useImperativeHandle(
    ref,
    () => ({
      element: elementRef.current,
      records,
      append,
      prepend,
      insert,
      set,
      remove,
    }),
    [records, append, prepend, insert, set, remove],
  );

  return (
    <WorkspaceContext.Provider
      value={{
        records,
        append,
        prepend,
        insert,
        set,
        remove,
        listeners,
        subscribe,
        unsubscribe,
      }}
    >
      <div {...attrs} data-ui-name="workspace" ref={elementRef} className={clsx(styles.root, attrs.className)}>
        <CanvasComponent dataKey={CanvasKey} />
        <EventControllerComponent />
      </div>
    </WorkspaceContext.Provider>
  );
});
WorkspaceComponent.displayName = 'Workspace';
