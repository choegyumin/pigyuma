import React from 'react';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import * as styles from './TextLayer.css';
import { TextLayerProps, TextLayerRef } from './types';

export const RawTextLayerComponent = React.forwardRef<TextLayerRef, TextLayerProps>((props, ref) => {
  const { data: textLayer } = props;

  return (
    <div data-ui-name="text-layer" data-ui-key={textLayer.key} ref={ref} className={styles.root} style={textLayer.style}>
      {textLayer.content}
    </div>
  );
});
RawTextLayerComponent.displayName = 'RawTextLayer';

export const TextLayerComponent = withUIRecord(RawTextLayerComponent);
TextLayerComponent.displayName = 'TextLayer';
