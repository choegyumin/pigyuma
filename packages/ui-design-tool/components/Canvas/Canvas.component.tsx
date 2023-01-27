import React from 'react';
import { UIRecordComponent } from '../UIRecord/UIRecord.component';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import * as styles from './Canvas.css';
import { CanvasProps, CanvasRef } from './types';

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

export const CanvasComponent = withUIRecord(RawCanvasComponent);
CanvasComponent.displayName = 'Canvas';
