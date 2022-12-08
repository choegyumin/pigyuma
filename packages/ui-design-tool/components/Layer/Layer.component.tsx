import React from 'react';
import { ShapeLayerComponent } from '../ShapeLayer/ShapeLayer.component';
import { ShapeLayer } from '../ShapeLayer/ShapeLayer.model';
import { TextLayerComponent } from '../TextLayer/TextLayer.component';
import { TextLayer } from '../TextLayer/TextLayer.model';
import { LayerProps, LayerRef } from './types';

export const LayerComponent = React.memo(
  React.forwardRef<LayerRef, LayerProps>((props, ref) => {
    const { layer } = props;

    if (layer instanceof ShapeLayer) {
      return <ShapeLayerComponent ref={ref} shapeLayer={layer} />;
    }

    if (layer instanceof TextLayer) {
      return <TextLayerComponent ref={ref} textLayer={layer} />;
    }

    return null;
  }),
);
LayerComponent.displayName = 'Layer';
