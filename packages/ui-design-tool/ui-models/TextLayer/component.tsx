import React from 'react';
import withData from '../withData';
import { TextLayer } from './model';
import * as styles from './styles.css';

export type TextLayerProps = {
  data: TextLayer;
};

export type TextLayerRef = HTMLDivElement;

export const RawTextLayerComponent = React.forwardRef<TextLayerRef, TextLayerProps>((props, ref) => {
  const { data: textLayer, ...restProps } = props;

  return (
    <div {...restProps} ref={ref} className={styles.root} style={textLayer.style}>
      {textLayer.content}
    </div>
  );
});
RawTextLayerComponent.displayName = 'RawTextLayer';

export const TextLayerComponent = withData(RawTextLayerComponent);
TextLayerComponent.displayName = 'TextLayer';
