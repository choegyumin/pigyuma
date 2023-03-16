import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import * as styles from './SelectionOverlay.css';
import { SelectionOverlayRendererProps } from './types';
import useRenderUtils from './useRenderUtils';

export const SelectionOverlayRenderer: React.FC<SelectionOverlayRendererProps> = (props) => {
  const { recordKey, onDocumentMouseMove, onDocumentMouseDown, onDocumentMouseUp } = props;
  const record = useUIRecordForInteraction(recordKey);

  const { getRootStyle } = useRenderUtils();

  useEventListener(document, 'mousemove', onDocumentMouseMove);
  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mouseup', onDocumentMouseUp);

  if (record == null) {
    return null;
  }

  const rootStyle = getRootStyle(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.outline} />
    </div>
  );
};
SelectionOverlayRenderer.displayName = 'SelectionOverlayRenderer';
