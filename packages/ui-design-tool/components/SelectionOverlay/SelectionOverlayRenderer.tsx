import { useUIRecordForInteraction } from '@/hooks';
import { useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import * as styles from './SelectionOverlay.css';
import { SelectionOverlayRendererProps } from './types';
import useRenderUtils from './useRenderUtils';

export const SelectionOverlayRenderer: React.FC<SelectionOverlayRendererProps> = (props) => {
  const { recordKey, onDocumentMouseMove, onDocumentMouseDown, onDocumentMouseUp } = props;
  const record = useUIRecordForInteraction(recordKey);

  const context = useContextForInteraction();

  const { getRootStyle } = useRenderUtils({ context });

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
