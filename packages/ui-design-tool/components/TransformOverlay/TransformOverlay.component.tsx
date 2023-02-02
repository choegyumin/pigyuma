import { useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { useUIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './TransformOverlay.css';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import useData from './useData';
import useExposeRef from './useExposeRef';
import useResizeHandlers from './useResizeHandlers';
import useRotateHandlers from './useRotateHandlers';
import useUIController from './useUIController';

export const TransformOverlay = React.memo(
  React.forwardRef<TransformOverlayRef, TransformOverlayProps>((props, ref) => {
    const api = useUIDesignToolAPI();

    const data = useData({ api, props, ref });
    const { rootRef, rootStyle, infoTextRef } = data;

    const uiController = useUIController({ api, props, ref, data });

    const { onResizeHandleMouseDown, onMouseUpForResize, onMouseMoveForResize } = useResizeHandlers({
      api,
      props,
      ref,
      data,
      uiController,
    });
    const { onRotateHandleMouseDown, onMouseUpForRotate, onMouseMoveForRotate } = useRotateHandlers({
      api,
      props,
      ref,
      data,
      uiController,
    });

    useExposeRef({ api, props, ref, data, uiController });

    useEventListener(document, 'mouseup', onMouseUpForResize);
    useEventListener(document, 'mousemove', onMouseMoveForResize);
    useEventListener(document, 'mouseup', onMouseUpForRotate);
    useEventListener(document, 'mousemove', onMouseMoveForRotate);

    /** @todo UIRecord.rotate 값에 따라 핸들 커서 스타일 클래스 교체, transform 중에는 중심축을 기준 좌표에 따라 전역으로 커서 교체 */
    return (
      <div ref={rootRef} className={styles.root} style={rootStyle.freeze()}>
        <div className={styles.wrapper}>
          <div className={styles.outline} />
          <div className={styles.rotateHandle$.topLeft} onMouseDown={onRotateHandleMouseDown} />
          <div className={styles.rotateHandle$.topRight} onMouseDown={onRotateHandleMouseDown} />
          <div className={styles.rotateHandle$.bottomRight} onMouseDown={onRotateHandleMouseDown} />
          <div className={styles.rotateHandle$.bottomLeft} onMouseDown={onRotateHandleMouseDown} />
          <div data-handle-placement="top" className={styles.resizeHandle$.top} onMouseDown={onResizeHandleMouseDown} />
          <div data-handle-placement="right" className={styles.resizeHandle$.right} onMouseDown={onResizeHandleMouseDown} />
          <div data-handle-placement="bottom" className={styles.resizeHandle$.bottom} onMouseDown={onResizeHandleMouseDown} />
          <div data-handle-placement="left" className={styles.resizeHandle$.left} onMouseDown={onResizeHandleMouseDown} />
          <div data-handle-placement="topLeft" className={styles.resizeCornerHandle$.topLeft} onMouseDown={onResizeHandleMouseDown} />
          <div data-handle-placement="topRight" className={styles.resizeCornerHandle$.topRight} onMouseDown={onResizeHandleMouseDown} />
          <div
            data-handle-placement="bottomRight"
            className={styles.resizeCornerHandle$.bottomRight}
            onMouseDown={onResizeHandleMouseDown}
          />
          <div data-handle-placement="bottomLeft" className={styles.resizeCornerHandle$.bottomLeft} onMouseDown={onResizeHandleMouseDown} />
        </div>
        <div className={styles.info}>
          <span ref={infoTextRef} />
        </div>
      </div>
    );
  }),
);
TransformOverlay.displayName = 'TransformOverlay';
