import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { UIInteractionElementDataAttributeName } from '@/types/Identifier';
import { useEventListener } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
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

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils();

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
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'topLeft',
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.topLeft)}
          style={{ cursor: rotateHandleCursorMap.topLeft }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'topRight',
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.topRight)}
          style={{ cursor: rotateHandleCursorMap.topRight }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'bottomRight',
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.bottomRight)}
          style={{ cursor: rotateHandleCursorMap.bottomRight }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'bottomLeft',
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.bottomLeft)}
          style={{ cursor: rotateHandleCursorMap.bottomLeft }}
          onMouseDown={onRotateHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'top',
          }}
          data-handle-placement="top"
          className={clsx(styles.resizeHandle, styles.resizeHandle$.top)}
          style={{ cursor: resizeHandleCursorMap.top }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'right',
          }}
          data-handle-placement="right"
          className={clsx(styles.resizeHandle, styles.resizeHandle$.right)}
          style={{ cursor: resizeHandleCursorMap.right }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'bottom',
          }}
          data-handle-placement="bottom"
          className={clsx(styles.resizeHandle, styles.resizeHandle$.bottom)}
          style={{ cursor: resizeHandleCursorMap.bottom }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'left',
          }}
          data-handle-placement="left"
          className={clsx(styles.resizeHandle, styles.resizeHandle$.left)}
          style={{ cursor: resizeHandleCursorMap.left }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'topLeft',
          }}
          data-handle-placement="topLeft"
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.topLeft)}
          style={{ cursor: resizeHandleCursorMap.topLeft }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'topRight',
          }}
          data-handle-placement="topRight"
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.topRight)}
          style={{ cursor: resizeHandleCursorMap.topRight }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'bottomRight',
          }}
          data-handle-placement="bottomRight"
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.bottomRight)}
          style={{ cursor: resizeHandleCursorMap.bottomRight }}
          onMouseDown={onResizeHandleMouseDown}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: 'bottomLeft',
          }}
          data-handle-placement="bottomLeft"
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.bottomLeft)}
          style={{ cursor: resizeHandleCursorMap.bottomLeft }}
          onMouseDown={onResizeHandleMouseDown}
        />
      </div>
      <div className={styles.info}>{infoText}</div>
    </div>
  );
};
TransformOverlayRenderer.displayName = 'TransformOverlayRenderer';
