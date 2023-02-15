import { CanvasComponent } from '@/api/Canvas/component';
import { Canvas } from '@/api/Canvas/model';
import { CanvasKey } from '@/types/Identifier';
import { cloneDeep } from '@pigyuma/utils';
import clsx from 'clsx';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { InteractionController } from '../InteractionController/InteractionController';
import { UIDesignToolAPIProvider } from '../UIDesignToolAPIProvider/UIDesignToolAPIProvider';
import { WorkspaceProps, WorkspaceRef } from './types';
import { WorkspaceContextProvider, UIDesignToolAPI } from './Workspace.context';
import * as styles from './Workspace.css';

/** @todo (설계가 일정 수준 이상 확정되면) 테스트 코드 작성 */
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
