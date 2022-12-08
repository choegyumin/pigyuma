import React from 'react';
import { ArtboardComponent } from '../Artboard/Artboard.component';
import { Artboard } from '../Artboard/Artboard.model';
import { LayerComponent } from '../Layer/Layer.component';
import { Layer } from '../Layer/Layer.model';
import { UIRecordProps, UIRecordRef } from './types';

export const UIRecordComponent = React.memo(
  React.forwardRef<UIRecordRef, UIRecordProps>((props, ref) => {
    const { record } = props;

    if (record instanceof Artboard) {
      return <ArtboardComponent ref={ref} artboard={record} />;
    }

    if (record instanceof Layer) {
      return <LayerComponent ref={ref} layer={record} />;
    }

    return null;
  }),
);
UIRecordComponent.displayName = 'UIRecord';
