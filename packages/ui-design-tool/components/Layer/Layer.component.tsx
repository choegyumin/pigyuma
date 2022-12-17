import React from 'react';
import { ShapeLayerComponent } from '../ShapeLayer/ShapeLayer.component';
import { ShapeLayer } from '../ShapeLayer/ShapeLayer.model';
import { TextLayerComponent } from '../TextLayer/TextLayer.component';
import { TextLayer } from '../TextLayer/TextLayer.model';
import { LayerProps, LayerRef } from './types';

/** @todo component와 model의 개념을 지속해서 반대로 가져갈 것인지 검토 */
export const LayerComponent = React.memo(
  React.forwardRef<LayerRef, LayerProps>((props, ref) => {
    const { layer, ...restProps } = props;

    if (layer instanceof ShapeLayer) {
      return <ShapeLayerComponent {...restProps} shapeLayer={layer} ref={ref} />;
    }

    if (layer instanceof TextLayer) {
      return <TextLayerComponent {...restProps} textLayer={layer} ref={ref} />;
    }

    return null;
  }),
);
LayerComponent.displayName = 'Layer';
