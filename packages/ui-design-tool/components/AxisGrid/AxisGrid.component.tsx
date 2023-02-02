import React from 'react';
import { useUIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './AxisGrid.css';
import { AxisGridProps, AxisGridRef } from './types';
import useData from './useData';
import useExposeRef from './useExposeRef';
import useUIController from './useUIController';

export const AxisGrid = React.memo(
  React.forwardRef<AxisGridRef, AxisGridProps>((props, ref) => {
    const api = useUIDesignToolAPI();

    const data = useData({ api, props, ref });
    const { rootRef, rootStyle } = data;

    const uiController = useUIController({ api, props, ref, data });

    useExposeRef({ api, props, ref, data, uiController });

    return (
      <div ref={rootRef} className={styles.root} style={rootStyle.freeze()}>
        <div className={styles.axis$.x} />
        <div className={styles.axis$.y} />
      </div>
    );
  }),
);
AxisGrid.displayName = 'AxisGrid';
