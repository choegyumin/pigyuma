import React, { useEffect } from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid.component';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay.component';
import { TransformOverlay } from '../TransformOverlay/TransformOverlay.component';
import { useUIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './InteractionController.css';
import { InteractionControllerProps, InteractionControllerRef } from './types';
import useData from './useData';
import useHandlers from './useHandlers';

export const InteractionController = React.memo(
  React.forwardRef<InteractionControllerRef, InteractionControllerProps>((props, ref) => {
    const api = useUIDesignToolAPI();

    const data = useData({ api, props, ref });
    const { axisGridRef, selectionOverlayRef, transformOverlayRef } = data;

    const { onSelectionChange, onTransformStart, onTransform, onTransformEnd } = useHandlers({
      api,
      props,
      ref,
      data,
    });

    useEffect(() => {
      selectionOverlayRef.current?.on();
    }, [selectionOverlayRef]);

    return (
      <div ref={ref} className={styles.root}>
        <AxisGrid ref={axisGridRef} />
        <SelectionOverlay ref={selectionOverlayRef} onChange={onSelectionChange} />
        <TransformOverlay
          ref={transformOverlayRef}
          onTransformStart={onTransformStart}
          onTransform={onTransform}
          onTransformEnd={onTransformEnd}
        />
      </div>
    );
  }),
);
InteractionController.displayName = 'InteractionController';
