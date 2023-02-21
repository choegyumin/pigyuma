import React from 'react';
import { UIRecordComponent } from '../UIRecord/component';
import withData from '../withData';
import { Canvas } from './model';
import * as styles from './styles.css';

export type CanvasProps = {
  data: Canvas;
};

export type CanvasRef = HTMLDivElement;

export const RawCanvasComponent = React.forwardRef<CanvasRef, CanvasProps>((props, ref) => {
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

export const CanvasComponent = withData(RawCanvasComponent);
CanvasComponent.displayName = 'Canvas';
