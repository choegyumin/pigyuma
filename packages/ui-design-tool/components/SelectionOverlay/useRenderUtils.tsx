import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import { UIRecord } from '@/api/UIRecord/model';
import useStatusMetadata from '@/hooks/useStatusMetadata';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod } from '@/types/Status';
import { isRotatableUIRecord } from '@/utils/model';
import { cursor } from '@pigyuma/css-utils';
import { toDegrees360 } from '@pigyuma/utils';
import { useCallback } from 'react';
import * as styles from './SelectionOverlay.css';

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
  const uiSelector = useUISelector();

  const statusMetadata = useStatusMetadata();

  const getMeta = useCallback(() => {
    const isIdle = statusMetadata.interactionType === UIDesignToolInteractionType.idle;
    const isDrawing = statusMetadata.interactionType === UIDesignToolInteractionType.drawing;
    const isTransforming = statusMetadata.interactionType === UIDesignToolInteractionType.transform;
    const isResizing = isTransforming && statusMetadata.transformMethod === UIDesignToolTransformMethod.resize;
    const isRotating = isTransforming && statusMetadata.transformMethod === UIDesignToolTransformMethod.rotate;

    const handleVisible = isIdle;
    const infoVisible = isDrawing || isResizing || isRotating;
    const outlineVisible = isIdle || isDrawing || isResizing || isRotating;
    const cursorVisible = isDrawing || isTransforming;

    return {
      isIdle,
      isDrawing,
      isTransforming,
      isResizing,
      isRotating,
      handleVisible,
      infoVisible,
      outlineVisible,
      cursorVisible,
    };
  }, [statusMetadata]);

  const getOverlayShapeStyle = useCallback(
    (record: UIRecord) => {
      const element = uiSelector.query({ key: record.key });
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
    [uiSelector],
  );

  const createSizeInfoText = useCallback(
    (record: UIRecord) => {
      const element = uiSelector.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${rect.width} × ${rect.height}` : '';
    },
    [uiSelector],
  );

  const createDegreesInfoText = useCallback(
    (record: UIRecord) => {
      const element = uiSelector.query({ key: record.key });
      /** @todo 우측 패널도 `Layer.rotate.length` 대신 `UIRecordRect.fromElement(element).rotate` 가 노출되어야 함 (데이터를 nested·combined 값으로 조작하면 잦은 변경이 발생하므로 rotate 값만 예외 케이스로 적절한 설계 필요) */
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${toDegrees360(rect.rotate)}°` : '';
    },
    [uiSelector],
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
      return meta.isDrawing || meta.isResizing
        ? createSizeInfoText(record)
        : meta.isRotating
        ? createDegreesInfoText(record)
        : initialInfoText;
    },
    [getMeta, createSizeInfoText, createDegreesInfoText],
  );

  const getResizeHandleCursorMap = useCallback(
    (record: UIRecord) => {
      if (!isRotatableUIRecord(record)) {
        return cursor.resizeMap(0);
      }
      const element = uiSelector.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return cursor.resizeMap(rect?.rotate || 0);
    },
    [uiSelector],
  );

  const getRotateHandleCursorMap = useCallback(
    (record: UIRecord) => {
      if (!isRotatableUIRecord(record)) {
        return cursor.rotateMap(0);
      }
      const element = uiSelector.query({ key: record.key });
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return cursor.rotateMap(rect?.rotate || 0);
    },
    [uiSelector],
  );

  return { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap };
}

export type UseRenderUtilsType = ReturnType<typeof useRenderUtils>;
