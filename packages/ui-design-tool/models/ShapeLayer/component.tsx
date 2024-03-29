import { InteractionHandleType, UIInteractionElementDataAttributeName } from '@/types/Identifier';
import React from 'react';
import { LayerComponent } from '../Layer/component';
import withModel from '../withModel';
import { ShapeLayer } from './model';
import * as styles from './styles.css';

export interface ShapeLayerProps {
  data: ShapeLayer;
}

export type ShapeLayerRefInstance = HTMLDivElement;

export const RawShapeLayerComponent = React.forwardRef<ShapeLayerRefInstance, ShapeLayerProps>((props, ref) => {
  const { data: shapeLayer, ...restProps } = props;

  return (
    <div
      {...restProps}
      ref={ref}
      className={styles.root}
      style={shapeLayer.style}
      {...{ [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.select }}
    >
      {shapeLayer.children.map((it) => (
        <LayerComponent key={it.key} dataKey={it.key} />
      ))}
    </div>
  );
});
RawShapeLayerComponent.displayName = 'RawShapeLayer';

export const ShapeLayerComponent = withModel(RawShapeLayerComponent);
ShapeLayerComponent.displayName = 'ShapeLayer';
