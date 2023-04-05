import React from 'react';
import { RawArtboardComponent } from '../Artboard/component';
import { Artboard } from '../Artboard/model';
import { RawLayerComponent } from '../Layer/component';
import { Layer } from '../Layer/model';
import withData from '../withData';
import { UIRecord } from './model';

export interface UIRecordProps {
  data: UIRecord;
}

export type UIRecordRef = HTMLDivElement;

/** @todo component와 model의 개념을 지속해서 반대로 가져갈 것인지 검토 */
export const RawUIRecordComponent = React.forwardRef<UIRecordRef, UIRecordProps>((props, ref) => {
  const { data: record, ...restProps } = props;

  if (record instanceof Artboard) {
    return <RawArtboardComponent {...restProps} data={record} ref={ref} />;
  }

  if (record instanceof Layer) {
    return <RawLayerComponent {...restProps} data={record} ref={ref} />;
  }

  return null;
});
RawUIRecordComponent.displayName = 'RawUIRecord';

export const UIRecordComponent = withData(RawUIRecordComponent);
UIRecordComponent.displayName = 'UIRecord';
