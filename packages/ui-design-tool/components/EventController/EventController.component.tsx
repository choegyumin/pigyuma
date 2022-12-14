import React, { useEffect } from 'react';
import { AxisGridComponent } from '../AxisGrid/AxisGrid.component';
import { HoveringOverlayComponent } from '../HoveringOverlay/HoveringOverlay.component';
import { TransformOverlayComponent } from '../TransformOverlay/TransformOverlay.component';
import * as styles from './EventController.css';
import { EventControllerProps, EventControllerRef } from './types';
import useData from './useData';
import useHandlers from './useHandlers';

export const EventControllerComponent = React.memo(
  React.forwardRef<EventControllerRef, EventControllerProps>((props, ref) => {
    const data = useData({ props, ref });
    const { axisGridRef, hoveringOverlayRef, transformOverlayRef } = data;

    const { onMouseDownForSelection, onMouseUpForSelection, onTransformStart, onTransformEnd, onResizeEnd, onRotateEnd } = useHandlers({
      props,
      ref,
      data,
    });

    useEffect(() => {
      document.addEventListener('mousedown', onMouseDownForSelection);
      return () => {
        document.removeEventListener('mousedown', onMouseDownForSelection);
      };
    }, [onMouseDownForSelection]);

    useEffect(() => {
      document.addEventListener('mouseup', onMouseUpForSelection);
      return () => {
        document.removeEventListener('mouseup', onMouseUpForSelection);
      };
    }, [onMouseUpForSelection]);

    useEffect(() => {
      hoveringOverlayRef.current?.on();
    }, [hoveringOverlayRef]);

    return (
      <div data-ui-name="event-controller" ref={ref} className={styles.root}>
        <AxisGridComponent ref={axisGridRef} />
        <HoveringOverlayComponent ref={hoveringOverlayRef} />
        <TransformOverlayComponent
          ref={transformOverlayRef}
          onTransformStart={onTransformStart}
          onTransformEnd={onTransformEnd}
          onResizeEnd={onResizeEnd}
          onRotateStart={onTransformStart}
          onRotateEnd={onRotateEnd}
        />
      </div>
    );
  }),
);
EventControllerComponent.displayName = 'EventController';
