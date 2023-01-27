import React from 'react';
import { LayerComponent } from '../Layer/Layer.component';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import * as styles from './ShapeLayer.css';
import { ShapeLayerProps, ShapeLayerRef } from './types';

export const RawShapeLayerComponent = React.forwardRef<ShapeLayerRef, ShapeLayerProps>((props, ref) => {
  const { data: shapeLayer, ...restProps } = props;

  return (
    <div {...restProps} ref={ref} className={styles.root} style={shapeLayer.style}>
      {shapeLayer.children.map((it) => (
        <LayerComponent key={it.key} dataKey={it.key} />
      ))}
    </div>
  );
});
RawShapeLayerComponent.displayName = 'RawShapeLayer';

export const ShapeLayerComponent = withUIRecord(RawShapeLayerComponent);
ShapeLayerComponent.displayName = 'ShapeLayer';
