import React, { useEffect } from 'react';
import * as styles from './HoveringOverlay.css';
import { HoveringOverlayProps, HoveringOverlayRef } from './types';
import useData from './useData';
import useExposeRef from './useExposeRef';
import useHandlers from './useHandlers';
import useUIController from './useUIController';

/**
 * @todo DOM Selector를 WorkspaceContext의 인터페이스로 구현 (document 대신 [data-ui-name="workspace"]에서 탐색)
 */
export const HoveringOverlayComponent = React.memo(
  React.forwardRef<HoveringOverlayRef, HoveringOverlayProps>((props, ref) => {
    const data = useData({ props, ref });
    const { rootRef, rootStyle } = data;

    const uiController = useUIController({ props, ref, data });

    const { onMouseMoveForHovering } = useHandlers({ props, ref, data, uiController });

    useExposeRef({ props, ref, data, uiController });

    useEffect(() => {
      document.addEventListener('mousemove', onMouseMoveForHovering);
      return () => {
        document.removeEventListener('mousemove', onMouseMoveForHovering);
      };
    }, [onMouseMoveForHovering]);

    return (
      <div data-ui-name="hovering-overlay" ref={rootRef} className={styles.root} style={rootStyle.freeze()}>
        <div className={styles.outline} />
      </div>
    );
  }),
);
HoveringOverlayComponent.displayName = 'HoveringOverlay';
