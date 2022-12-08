import React from 'react';
import { LayerComponent } from '../Layer/Layer.component';
import * as styles from './ShapeLayer.css';
import { ShapeLayerProps, ShapeLayerRef } from './types';

export const ShapeLayerComponent = React.memo(
  React.forwardRef<ShapeLayerRef, ShapeLayerProps>((props, ref) => {
    const { shapeLayer } = props;

    return (
      <div data-ui-name="shape-layer" data-ui-key={shapeLayer.key} ref={ref} className={styles.root} style={shapeLayer.style}>
        {shapeLayer.children.map((it) => (
          <LayerComponent key={it.key} layer={it} />
        ))}
      </div>
    );
  }),
);
ShapeLayerComponent.displayName = 'ShapeLayer';
