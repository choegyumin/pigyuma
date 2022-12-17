import React from 'react';
import * as styles from './TextLayer.css';
import { TextLayerProps, TextLayerRef } from './types';

export const TextLayerComponent = React.memo(
  React.forwardRef<TextLayerRef, TextLayerProps>((props, ref) => {
    const { textLayer, ...restProps } = props;

    return (
      <div {...restProps} ref={ref} className={styles.root} style={textLayer.style}>
        {textLayer.content}
      </div>
    );
  }),
);
TextLayerComponent.displayName = 'TextLayer';
