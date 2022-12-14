import React from 'react';
import { RawShapeLayerComponent } from '../ShapeLayer/ShapeLayer.component';
import { ShapeLayer } from '../ShapeLayer/ShapeLayer.model';
import { RawTextLayerComponent } from '../TextLayer/TextLayer.component';
import { TextLayer } from '../TextLayer/TextLayer.model';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import { LayerProps, LayerRef } from './types';

export const RawLayerComponent = React.forwardRef<LayerRef, LayerProps>((props, ref) => {
  const { data: layer } = props;

  if (layer instanceof ShapeLayer) {
    return <RawShapeLayerComponent ref={ref} data={layer} />;
  }

  if (layer instanceof TextLayer) {
    return <RawTextLayerComponent ref={ref} data={layer} />;
  }

  return null;
});
RawLayerComponent.displayName = 'RawLayer';

export const LayerComponent = withUIRecord(RawLayerComponent);
LayerComponent.displayName = 'Layer';
