import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { UIRecord } from '@/api/UIRecord/model';
import { useStatus, useUIElement } from '@/hooks';
import { UIRecordRect } from '@/types/Geometry';
import { isRotatableUIRecord } from '@/utils/model';
import { cursor } from '@pigyuma/ui/styles/extensions';
import { toDegrees360 } from '@pigyuma/utils';
import { useCallback } from 'react';
import * as styles from './TransformOverlay.css';

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

export default function useRenderUtils() {
  const uiElementAPI = useUIElement();

  const status = useStatus();

  const getMeta = useCallback(() => {
    const isIdle = status === UIDesignToolStatus.idle;
    const isResizing = status === UIDesignToolStatus.resizing;
    const isRotating = status === UIDesignToolStatus.rotating;
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
  }, [status]);

  const getOverlayShapeStyle = useCallback(
    (record: UIRecord) => {
      const element = uiElementAPI.query({ key: record.key });
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
    [uiElementAPI],
  );

  const createSizeInfoText = useCallback(
    (record: UIRecord) => {
      const element = uiElementAPI.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${rect.width} × ${rect.height}` : '';
    },
    [uiElementAPI],
  );

  const createDegreesInfoText = useCallback(
    (record: UIRecord) => {
      const element = uiElementAPI.query({ key: record.key });
      /** @todo 우측 패널도 `Layer.rotate.length` 대신 `UIRecordRect.fromElement(element).rotate` 가 노출되어야 함 (데이터를 nested·combined 값으로 조작하면 잦은 변경이 발생하므로 rotate 값만 예외 케이스로 적절한 설계 필요) */
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${toDegrees360(rect.rotate)}°` : '';
    },
    [uiElementAPI],
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
    (record: UIRecord) => {
      if (!isRotatableUIRecord(record)) {
        return cursor.resizeMap(0);
      }
      const element = uiElementAPI.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return cursor.resizeMap(rect?.rotate || 0);
    },
    [uiElementAPI],
  );

  const getRotateHandleCursorMap = useCallback(
    (record: UIRecord) => {
      if (!isRotatableUIRecord(record)) {
        return cursor.rotateMap(0);
      }
      const element = uiElementAPI.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return cursor.rotateMap(rect?.rotate || 0);
    },
    [uiElementAPI],
  );

  return { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap };
}

export type UseRenderUtilsType = ReturnType<typeof useRenderUtils>;
