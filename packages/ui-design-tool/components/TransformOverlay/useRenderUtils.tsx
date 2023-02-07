import { UIRecordRect } from '@/types/Shape';
import { isRotatableUIRecord } from '@/utils/model';
import { cursor } from '@pigyuma/ui/styles/extensions';
import { toDegrees360 } from '@pigyuma/utils';
import { useCallback } from 'react';
import { Artboard } from '../Artboard/Artboard.model';
import { Layer } from '../Layer/Layer.model';
import { UIRecord } from '../UIRecord/UIRecord.model';
import { WorkspaceStatus } from '../Workspace/types';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import * as styles from './TransformOverlay.css';

export type UseRenderUtilsDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

const initialRootStyle = {
  [styles.varNames.x]: 0,
  [styles.varNames.y]: 0,
  [styles.varNames.width]: 0,
  [styles.varNames.height]: 0,
  [styles.varNames.rotate]: 0,
  [styles.varNames.visibility]: 'hidden',
  [styles.varNames.handleVisibility]: 'hidden',
  [styles.varNames.infoVisibility]: 'hidden',
  [styles.varNames.outlineVisibility]: 'hidden',
};

const initialInfoText = '';

export default function useRenderUtils(deps: UseRenderUtilsDependencys) {
  const { context } = deps;

  const getMeta = useCallback(() => {
    const isIdle = context.status === WorkspaceStatus.idle;
    const isResizing = context.status === WorkspaceStatus.resizing;
    const isRotating = context.status === WorkspaceStatus.rotating;
    const isTransforming = isResizing || isRotating;

    const handleVisible = isIdle;
    const infoVisible = isTransforming;
    const outlineVisible = isIdle;
    const cursorVisible = isTransforming;

    return {
      isIdle,
      isResizing,
      isRotating,
      isTransforming,
      handleVisible,
      infoVisible,
      outlineVisible,
      cursorVisible,
    };
  }, [context]);

  const getOverlayShapeStyle = useCallback(
    (record: UIRecord) => {
      const element = context.query({ key: record.key });
      if (element == null) {
        return {
          [styles.varNames.x]: 0,
          [styles.varNames.y]: 0,
          [styles.varNames.width]: 0,
          [styles.varNames.height]: 0,
          [styles.varNames.rotate]: 0,
        };
      }

      const { x, y, width, height, rotate } = UIRecordRect.fromElement(element);
      // resize, rotate를 고려해 x, y를 중심축으로 설정
      return {
        [styles.varNames.x]: `${x + width / 2}px`,
        [styles.varNames.y]: `${y + height / 2}px`,
        [styles.varNames.width]: `${width}px`,
        [styles.varNames.height]: `${height}px`,
        [styles.varNames.rotate]: `${rotate}deg`,
      };
    },
    [context],
  );

  const createSizeInfoText = useCallback(
    (record: UIRecord) => {
      const element = context.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${rect.width} × ${rect.height}` : '';
    },
    [context],
  );

  const createDegreesInfoText = useCallback(
    (record: UIRecord) => {
      const element = context.query({ key: record.key });
      /** @todo 우측 패널도 `Layer.rotate.length` 대신 `UIRecordRect.fromElement(element).rotate` 가 노출되어야 함 */
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${toDegrees360(rect.rotate)}°` : '';
    },
    [context],
  );

  const getRootStyle = useCallback(
    (record: UIRecord) => {
      if (!(record instanceof Artboard || record instanceof Layer)) {
        return initialRootStyle;
      }

      const meta = getMeta();
      return {
        ...getOverlayShapeStyle(record),
        [styles.varNames.visibility]: 'visible',
        [styles.varNames.handleVisibility]: meta.handleVisible ? 'visible' : 'hidden',
        [styles.varNames.infoVisibility]: meta.infoVisible ? 'visible' : 'hidden',
        [styles.varNames.outlineVisibility]: meta.outlineVisible ? 'visible' : 'hidden',
      };
    },
    [getMeta, getOverlayShapeStyle],
  );

  const getInfoText = useCallback(
    (record: UIRecord) => {
      if (!(record instanceof Artboard || record instanceof Layer)) {
        return initialInfoText;
      }

      const meta = getMeta();
      return meta.isResizing ? createSizeInfoText(record) : meta.isRotating ? createDegreesInfoText(record) : initialInfoText;
    },
    [getMeta, createSizeInfoText, createDegreesInfoText],
  );

  const getResizeHandleCursorMap = useCallback(
    (record: UIRecord) => cursor.resizeMap(isRotatableUIRecord(record) ? record.rotate.length : 0),
    [],
  );

  const getRotateHandleCursorMap = useCallback(
    (record: UIRecord) => cursor.rotateMap(isRotatableUIRecord(record) ? record.rotate.length : 0),
    [],
  );

  return { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap };
}

export type UseRenderUtilsType = ReturnType<typeof useRenderUtils>;