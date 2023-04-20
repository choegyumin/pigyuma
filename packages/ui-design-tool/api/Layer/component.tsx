import React from 'react';
import { RawShapeLayerComponent } from '../ShapeLayer/component';
import { ShapeLayer } from '../ShapeLayer/model';
import { RawTextLayerComponent } from '../TextLayer/component';
import { TextLayer } from '../TextLayer/model';
import withModel from '../withModel';
import { Layer } from './model';

export interface LayerProps {
  data: Layer;
}

export type LayerRef = HTMLDivElement;

/** @todo component와 model의 개념을 지속해서 반대로 가져갈 것인지 검토 */
export const RawLayerComponent = React.forwardRef<LayerRef, LayerProps>((props, ref) => {
  const { data: layer, ...restProps } = props;

  if (layer instanceof ShapeLayer) {
    return <RawShapeLayerComponent {...restProps} data={layer} ref={ref} />;
  }

  if (layer instanceof TextLayer) {
    return <RawTextLayerComponent {...restProps} data={layer} ref={ref} />;
  }

  return null;
});
RawLayerComponent.displayName = 'RawLayer';

export const LayerComponent = withModel(RawLayerComponent);
LayerComponent.displayName = 'Layer';
