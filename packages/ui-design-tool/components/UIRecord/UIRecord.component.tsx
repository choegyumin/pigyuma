import React from 'react';
import { ArtboardComponent } from '../Artboard/Artboard.component';
import { Artboard } from '../Artboard/Artboard.model';
import { LayerComponent } from '../Layer/Layer.component';
import { Layer } from '../Layer/Layer.model';
import { UIRecordProps, UIRecordRef } from './types';

/** @todo component와 model의 개념을 지속해서 반대로 가져갈 것인지 검토 */
export const UIRecordComponent = React.memo(
  React.forwardRef<UIRecordRef, UIRecordProps>((props, ref) => {
    const { record, ...restProps } = props;

    if (record instanceof Artboard) {
      return <ArtboardComponent {...restProps} artboard={record} ref={ref} />;
    }

    if (record instanceof Layer) {
      return <LayerComponent {...restProps} layer={record} ref={ref} />;
    }

    return null;
  }),
);
UIRecordComponent.displayName = 'UIRecord';
