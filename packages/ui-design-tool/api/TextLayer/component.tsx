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
    <div
      {...restProps}
      ref={ref}
      className={styles.root}
      style={textLayer.style}
      dangerouslySetInnerHTML={{
        __html: textLayer.content.replaceAll(/(\r\n|\r|\n)/g, '<br />'),
      }}
    />
  );
});
RawTextLayerComponent.displayName = 'RawTextLayer';

export const TextLayerComponent = withData(RawTextLayerComponent);
TextLayerComponent.displayName = 'TextLayer';
