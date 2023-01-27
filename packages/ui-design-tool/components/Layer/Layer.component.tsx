import React from 'react';
import { RawShapeLayerComponent } from '../ShapeLayer/ShapeLayer.component';
import { ShapeLayer } from '../ShapeLayer/ShapeLayer.model';
import { RawTextLayerComponent } from '../TextLayer/TextLayer.component';
import { TextLayer } from '../TextLayer/TextLayer.model';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import { LayerProps, LayerRef } from './types';

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

export const LayerComponent = withUIRecord(RawLayerComponent);
LayerComponent.displayName = 'Layer';
