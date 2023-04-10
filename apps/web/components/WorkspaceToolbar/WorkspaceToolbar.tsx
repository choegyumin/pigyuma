import Icon from '@pigyuma/design-system/components/Icon';
import { useEventListener } from '@pigyuma/react-utils';
import { UIDesignToolMode } from '@pigyuma/ui-design-tool/types/Status';
import clsx from 'clsx';
import React from 'react';
import Toolbar from '../Toolbar';
import { WorkspaceToolbarProps, WorkspaceToolbarRef } from './types';
import useWorkspaceToolbar from './useWorkspaceToolbar';
import * as styles from './WorkspaceToolbar.css';

const WorkspaceToolbar = React.forwardRef<WorkspaceToolbarRef, WorkspaceToolbarProps>((props, ref) => {
  const viewModel = useWorkspaceToolbar(props, ref);

  useEventListener(() => document, 'keydown', viewModel?.onDocumentKeyDown);

  if (viewModel == null) {
    return null;
  }

  const { selectedMode, onSelectClick, onArtboardClick, onShapeClick } = viewModel;

  /** @todo title을 Tooltip 컴포넌트로 대체 */
  return (
    <Toolbar {...props} ref={ref} className={clsx(styles.root, props.className)}>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: selectedMode === UIDesignToolMode.select })}
        onClick={onSelectClick}
        title="Select & Move (V)"
        aria-label="Select & Move"
        aria-keyshortcuts="V"
        aria-pressed={selectedMode === UIDesignToolMode.select}
      >
        <Icon type="cursorOutline" />
      </button>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: selectedMode === UIDesignToolMode.artboard })}
        onClick={onArtboardClick}
        title="Artboard (F)"
        aria-label="Artboard"
        aria-keyshortcuts="F"
        aria-pressed={selectedMode === UIDesignToolMode.artboard}
      >
        <Icon type="layoutOutline" />
      </button>
      <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: selectedMode === UIDesignToolMode.shape })}
        onClick={onShapeClick}
        title="Shape (S)"
        aria-label="Shape"
        aria-keyshortcuts="S"
        aria-pressed={selectedMode === UIDesignToolMode.shape}
      >
        <Icon type="squareOutline" />
      </button>
      {/** @todo TextLayer 추가 및 수정 기능 구현 */}
      {/* <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: selectedMode === UIDesignToolMode.text })}
        onClick={onTextClick}
        title="Text (T)"
        aria-label="Text"
        aria-keyshortcuts="T"
        aria-pressed={selectedMode === UIDesignToolMode.text}
      >
        <Icon type="text" />
      </button> */}
      {/** @todo Zoom & Panning 기능 구현 */}
      {/* <button
        type="button"
        className={clsx(styles.button, { [styles.button_state.selected]: selectedMode === UIDesignToolMode.hand })}
        onClick={onHandClick}
        title="Hand (H)"
        aria-label="Hand"
        aria-keyshortcuts="H"
        aria-pressed={selectedMode === UIDesignToolMode.hand}
      >
        <Icon type="handOutline" />
      </button> */}
    </Toolbar>
  );
});
WorkspaceToolbar.displayName = 'WorkspaceToolbar';

export default WorkspaceToolbar;
