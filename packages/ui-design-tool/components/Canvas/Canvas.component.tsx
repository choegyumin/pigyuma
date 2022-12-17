import React from 'react';
import { UIRecordComponent } from '../UIRecord/UIRecord.component';
import * as styles from './Canvas.css';
import { CanvasProps, CanvasRef } from './types';

export const CanvasComponent = React.memo(
  React.forwardRef<CanvasRef, CanvasProps>((props, ref) => {
    const { canvas, ...restProps } = props;

    return (
      <div {...restProps} ref={ref} className={styles.root}>
        {canvas.children.map((record) => (
          <UIRecordComponent key={record.key} record={record} />
        ))}
      </div>
    );
  }),
);
CanvasComponent.displayName = 'Canvas';
