import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import * as styles from './TransformOverlay.css';
import { TransformOverlayRendererProps } from './types';
import useRenderUtils from './useRenderUtils';

export const TransformOverlayRenderer: React.FC<TransformOverlayRendererProps> = (props) => {
  const {
    recordKey,
    onResizeHandleMouseDown,
    onDocumentMouseUpForResize,
    onDocumentMouseMoveForResize,
    onDocuemntKeyDownUpForResize,
    onRotateHandleMouseDown,
    onDocumentMouseUpForRotate,
    onDocumentMouseMoveForRotate,
  } = props;
  const record = useUIRecordForInteraction(recordKey);

  const context = useContextForInteraction();

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils({ context });

  useEventListener(document, 'keydown', onDocuemntKeyDownUpForResize);
  useEventListener(document, 'keyup', onDocuemntKeyDownUpForResize);
  useEventListener(document, 'mouseup', onDocumentMouseUpForResize);
  useEventListener(document, 'mousemove', onDocumentMouseMoveForResize);

  useEventListener(document, 'mouseup', onDocumentMouseUpForRotate);
  useEventListener(document, 'mousemove', onDocumentMouseMoveForRotate);

  if (record == null) {
    return null;
  }

  const rootStyle = getRootStyle(record);
  const infoText = getInfoText(record);
  const resizeHandleCursorMap = getResizeHandleCursorMap(record);
  const rotateHandleCursorMap = getRotateHandleCursorMap(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.wrapper}>
        <div className={styles.outline} />
        <div
          className={styles.rotateHandle$.topLeft}
          style={{ cursor: rotateHandleCursorMap.topLeft }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          className={styles.rotateHandle$.topRight}
          style={{ cursor: rotateHandleCursorMap.topRight }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          className={styles.rotateHandle$.bottomRight}
          style={{ cursor: rotateHandleCursorMap.bottomRight }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          className={styles.rotateHandle$.bottomLeft}
          style={{ cursor: rotateHandleCursorMap.bottomLeft }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          data-handle-placement="top"
          className={styles.resizeHandle$.top}
          style={{ cursor: resizeHandleCursorMap.top }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="right"
          className={styles.resizeHandle$.right}
          style={{ cursor: resizeHandleCursorMap.right }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="bottom"
          className={styles.resizeHandle$.bottom}
          style={{ cursor: resizeHandleCursorMap.bottom }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="left"
          className={styles.resizeHandle$.left}
          style={{ cursor: resizeHandleCursorMap.left }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="topLeft"
          className={styles.resizeCornerHandle$.topLeft}
          style={{ cursor: resizeHandleCursorMap.topLeft }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="topRight"
          className={styles.resizeCornerHandle$.topRight}
          style={{ cursor: resizeHandleCursorMap.topRight }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="bottomRight"
          className={styles.resizeCornerHandle$.bottomRight}
          style={{ cursor: resizeHandleCursorMap.bottomRight }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          data-handle-placement="bottomLeft"
          className={styles.resizeCornerHandle$.bottomLeft}
          style={{ cursor: resizeHandleCursorMap.bottomLeft }}
          onMouseDown={onResizeHandleMouseDown}
        />
      </div>
      <div className={styles.info}>{infoText}</div>
    </div>
  );
};
TransformOverlayRenderer.displayName = 'TransformOverlayRenderer';
