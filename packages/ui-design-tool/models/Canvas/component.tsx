import React from 'react';
import { UIRecordComponent } from '../UIRecord/component';
import withModel from '../withModel';
import { Canvas } from './model';
import * as styles from './styles.css';

export interface CanvasProps {
  data: Canvas;
}

export type CanvasRefInstance = HTMLDivElement;

export const RawCanvasComponent = React.forwardRef<CanvasRefInstance, CanvasProps>((props, ref) => {
  const { data: canvas, ...restProps } = props;

  return (
    <div {...restProps} ref={ref} className={styles.root}>
      {canvas.children.map((record) => (
        <UIRecordComponent key={record.key} dataKey={record.key} />
      ))}
    </div>
  );
});
RawCanvasComponent.displayName = 'RawCanvas';

export const CanvasComponent = withModel(RawCanvasComponent);
CanvasComponent.displayName = 'Canvas';
