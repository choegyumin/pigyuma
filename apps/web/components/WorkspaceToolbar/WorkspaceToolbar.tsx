import Icon from '@pigyuma/design-system/components/Icon';
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import { useUIController, useUIData } from '@pigyuma/ui-design-tool';
import { UIDesignToolMode, UIDesignToolStatus } from '@pigyuma/ui-design-tool/api/UIDesignTool';
import clsx from 'clsx';
import React from 'react';
import Toolbar from '../Toolbar';
import { WorkspaceToolbarProps, WorkspaceToolbarRef } from './types';
import * as styles from './WorkspaceToolbar.css';

const WorkspaceToolbar = React.forwardRef<WorkspaceToolbarRef, WorkspaceToolbarProps>((props, ref) => {
  const uiController = useUIController();
  const uiData = useUIData();

  const onSelectClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.select);
  });

  const onArtboardClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.artboard);
  });

  const onShapeClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.shape);
  });

  const onTextClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.text);
  });

  const onHandClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.hand);
  });

  const onKeyDown = useEvent((event: KeyboardEvent) => {
    if (uiData.status !== UIDesignToolStatus.idle) {
      return;
    }
    switch (event.code) {
      case 'KeyV':
        return uiController.toggleMode(UIDesignToolMode.select);
      case 'KeyF':
        return uiController.toggleMode(UIDesignToolMode.artboard);
      case 'KeyS':
        return uiController.toggleMode(UIDesignToolMode.shape);
      case 'KeyT':
        return uiController.toggleMode(UIDesignToolMode.text);
      case 'KeyH':
        return uiController.toggleMode(UIDesignToolMode.hand);
    }
  });

  useEventListener(() => document, 'keydown', onKeyDown);

  /** @todo title을 Tooltip 컴포넌트로 대체 */
  return (
    <Toolbar {...props} ref={ref} className={clsx(styles.root, props.className)}>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: uiData.mode === UIDesignToolMode.select })}
        onClick={onSelectClick}
        title="Select & Move (V)"
        aria-label="Select & Move"
        aria-keyshortcuts="V"
        aria-pressed={uiData.mode === UIDesignToolMode.select}
      >
        <Icon type="cursorOutline" />
      </button>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: uiData.mode === UIDesignToolMode.artboard })}
        onClick={onArtboardClick}
        title="Artboard (F)"
        aria-label="Artboard"
        aria-keyshortcuts="F"
        aria-pressed={uiData.mode === UIDesignToolMode.artboard}
      >
        <Icon type="layoutOutline" />
      </button>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: uiData.mode === UIDesignToolMode.shape })}
        onClick={onShapeClick}
        title="Shape (S)"
        aria-label="Shape"
        aria-keyshortcuts="S"
        aria-pressed={uiData.mode === UIDesignToolMode.shape}
      >
        <Icon type="squareOutline" />
      </button>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: uiData.mode === UIDesignToolMode.text })}
        onClick={onTextClick}
        title="Text (T)"
        aria-label="Text"
        aria-keyshortcuts="T"
        aria-pressed={uiData.mode === UIDesignToolMode.text}
      >
        <Icon type="text" />
      </button>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: uiData.mode === UIDesignToolMode.hand })}
        onClick={onHandClick}
        title="Hand (H)"
        aria-label="Hand"
        aria-keyshortcuts="H"
        aria-pressed={uiData.mode === UIDesignToolMode.hand}
      >
        <Icon type="handOutline" />
      </button>
    </Toolbar>
  );
});
WorkspaceToolbar.displayName = 'WorkspaceToolbar';

export default WorkspaceToolbar;
