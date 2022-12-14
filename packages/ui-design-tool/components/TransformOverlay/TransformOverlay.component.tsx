import React, { useEffect } from 'react';
import * as styles from './TransformOverlay.css';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import useData from './useData';
import useExposeRef from './useExposeRef';
import useResizeHandlers from './useResizeHandlers';
import useRotateHandlers from './useRotateHandlers';
import useUIController from './useUIController';

/**
 * @todo DOM Selector를 WorkspaceContext의 인터페이스로 구현 (document 대신 [data-ui-name="workspace"]에서 탐색)
 * @todo 인터랙션 상태 세분화 및 규격화? (XState?)
 * @todo 인터랙션 단위로 hooks 모듈 분리
 * @todo ref API를 통한 레이어 스타일 제어는 WorkspaceContext의 API 사용 (인터랙션은 실시간 제어)
 */
export const TransformOverlayComponent = React.memo(
  React.forwardRef<TransformOverlayRef, TransformOverlayProps>((props, ref) => {
    const data = useData({ props, ref });
    const { rootRef, rootStyle, transformTextRef } = data;

    const uiController = useUIController({ props, ref, data });

    const { onResizeHandleMouseDown, onMouseUpForResize, onMouseMoveForResize } = useResizeHandlers({ props, ref, data, uiController });
    const { onRotateHandleMouseDown, onMouseUpForRotate, onMouseMoveForRotate } = useRotateHandlers({ props, ref, data, uiController });

    useExposeRef({ props, ref, data, uiController });

    useEffect(() => {
      document.addEventListener('mouseup', onMouseUpForResize);
      return () => {
        document.removeEventListener('mouseup', onMouseUpForResize);
      };
    }, [onMouseUpForResize]);

    useEffect(() => {
      document.addEventListener('mousemove', onMouseMoveForResize);
      return () => {
        document.removeEventListener('mousemove', onMouseMoveForResize);
      };
    }, [onMouseMoveForResize]);

    useEffect(() => {
      document.addEventListener('mouseup', onMouseUpForRotate);
      return () => {
        document.removeEventListener('mouseup', onMouseUpForRotate);
      };
    }, [onMouseUpForRotate]);

    useEffect(() => {
      document.addEventListener('mousemove', onMouseMoveForRotate);
      return () => {
        document.removeEventListener('mousemove', onMouseMoveForRotate);
      };
    }, [onMouseMoveForRotate]);

    return (
      <div data-ui-name="transform-overlay" ref={rootRef} className={styles.root} style={rootStyle.freeze()}>
        <div className={styles.wrapper}>
          <div className={styles.outline} />
          <div className={styles.rotateHandle$.topLeft} onMouseDown={onRotateHandleMouseDown} />
          <div className={styles.rotateHandle$.topRight} onMouseDown={onRotateHandleMouseDown} />
          <div className={styles.rotateHandle$.bottomRight} onMouseDown={onRotateHandleMouseDown} />
          <div className={styles.rotateHandle$.bottomLeft} onMouseDown={onRotateHandleMouseDown} />
          <div data-ui-handle-target="top" className={styles.resizeHandle$.top} onMouseDown={onResizeHandleMouseDown} />
          <div data-ui-handle-target="right" className={styles.resizeHandle$.right} onMouseDown={onResizeHandleMouseDown} />
          <div data-ui-handle-target="bottom" className={styles.resizeHandle$.bottom} onMouseDown={onResizeHandleMouseDown} />
          <div data-ui-handle-target="left" className={styles.resizeHandle$.left} onMouseDown={onResizeHandleMouseDown} />
          <div data-ui-handle-target="topLeft" className={styles.resizeRatioHandle$.topLeft} onMouseDown={onResizeHandleMouseDown} />
          <div data-ui-handle-target="topRight" className={styles.resizeRatioHandle$.topRight} onMouseDown={onResizeHandleMouseDown} />
          <div
            data-ui-handle-target="bottomRight"
            className={styles.resizeRatioHandle$.bottomRight}
            onMouseDown={onResizeHandleMouseDown}
          />
          <div data-ui-handle-target="bottomLeft" className={styles.resizeRatioHandle$.bottomLeft} onMouseDown={onResizeHandleMouseDown} />
        </div>
        <div className={styles.transform}>
          <span ref={transformTextRef} />
        </div>
      </div>
    );
  }),
);
TransformOverlayComponent.displayName = 'TransformOverlay';
