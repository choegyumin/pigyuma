import React from 'react';
import { RawArtboardComponent } from '../Artboard/Artboard.component';
import { Artboard } from '../Artboard/Artboard.model';
import { RawLayerComponent } from '../Layer/Layer.component';
import { Layer } from '../Layer/Layer.model';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import { UIRecordProps, UIRecordRef } from './types';

export const RawUIRecordComponent = React.forwardRef<UIRecordRef, UIRecordProps>((props, ref) => {
  const { data: record } = props;

  if (record instanceof Artboard) {
    return <RawArtboardComponent ref={ref} data={record} />;
  }

  if (record instanceof Layer) {
    return <RawLayerComponent ref={ref} data={record} />;
  }

  return null;
});
RawUIRecordComponent.displayName = 'RawUIRecord';

export const UIRecordComponent = withUIRecord(RawUIRecordComponent);
UIRecordComponent.displayName = 'UIRecord';
