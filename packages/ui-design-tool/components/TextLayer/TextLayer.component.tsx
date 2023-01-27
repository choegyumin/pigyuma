import React from 'react';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import * as styles from './TextLayer.css';
import { TextLayerProps, TextLayerRef } from './types';

export const RawTextLayerComponent = React.forwardRef<TextLayerRef, TextLayerProps>((props, ref) => {
  const { data: textLayer, ...restProps } = props;

  return (
    <div {...restProps} ref={ref} className={styles.root} style={textLayer.style}>
      {textLayer.content}
    </div>
  );
});
RawTextLayerComponent.displayName = 'RawTextLayer';

export const TextLayerComponent = withUIRecord(RawTextLayerComponent);
TextLayerComponent.displayName = 'TextLayer';
