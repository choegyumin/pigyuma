import { useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { useUIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './SelectionOverlay.css';
import { SelectionOverlayProps, SelectionOverlayRef } from './types';
import useData from './useData';
import useExposeRef from './useExposeRef';
import useHandlers from './useHandlers';
import useUIController from './useUIController';

export const SelectionOverlay = React.memo(
  React.forwardRef<SelectionOverlayRef, SelectionOverlayProps>((props, ref) => {
    const api = useUIDesignToolAPI();

    const data = useData({ api, props, ref });
    const { rootRef, rootStyle } = data;

    const uiController = useUIController({ api, props, ref, data });

    const { onMouseMoveForSelection, onMouseDownForSelection, onMouseUpForSelection } = useHandlers({
      api,
      props,
      ref,
      data,
      uiController,
    });

    useExposeRef({ api, props, ref, data, uiController });

    useEventListener(document, 'mousemove', onMouseMoveForSelection);
    useEventListener(document, 'mousedown', onMouseDownForSelection);
    useEventListener(document, 'mouseup', onMouseUpForSelection);

    return (
      <div ref={rootRef} className={styles.root} style={rootStyle.freeze()}>
        <div className={styles.outline} />
      </div>
    );
  }),
);
SelectionOverlay.displayName = 'SelectionOverlay';
