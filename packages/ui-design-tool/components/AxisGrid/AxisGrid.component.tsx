import React from 'react';
import * as styles from './AxisGrid.css';
import { AxisGridProps, AxisGridRef } from './types';
import useData from './useData';
import useExposeRef from './useExposeRef';
import useUIController from './useUIController';

/**
 * @todo DOM Selector를 WorkspaceContext의 인터페이스로 구현 (document 대신 [data-ui-name="workspace"]에서 탐색)
 */
export const AxisGridComponent = React.memo(
  React.forwardRef<AxisGridRef, AxisGridProps>((props, ref) => {
    const data = useData({ props, ref });
    const { rootRef, rootStyle } = data;

    const uiController = useUIController({ props, ref, data });

    useExposeRef({ props, ref, data, uiController });

    return (
      <div data-ui-name="axis-grid" ref={rootRef} className={styles.root} style={rootStyle.freeze()}>
        <div className={styles.axis$.x} />
        <div className={styles.axis$.y} />
      </div>
    );
  }),
);
AxisGridComponent.displayName = 'AxisGrid';
