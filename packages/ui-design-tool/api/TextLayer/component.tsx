import { InteractionHandleType, UIInteractionElementDataAttributeName } from '@/types/Identifier';
import React from 'react';
import withModel from '../withModel';
import { TextLayer } from './model';
import * as styles from './styles.css';

export interface TextLayerProps {
  data: TextLayer;
}

export type TextLayerRef = HTMLDivElement;

export const RawTextLayerComponent = React.forwardRef<TextLayerRef, TextLayerProps>((props, ref) => {
  const { data: textLayer, ...restProps } = props;

  return (
    <div
      {...restProps}
      ref={ref}
      className={styles.root}
      style={textLayer.style}
      {...{ [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.select }}
      dangerouslySetInnerHTML={{
        __html: textLayer.content.replaceAll(/(\r\n|\r|\n)/g, '<br />'),
      }}
    />
  );
});
RawTextLayerComponent.displayName = 'RawTextLayer';

export const TextLayerComponent = withModel(RawTextLayerComponent);
TextLayerComponent.displayName = 'TextLayer';
