import { Artboard } from '@/models/Artboard/model';
import { Layer } from '@/models/Layer/model';
import { UIRecord } from '@/models/UIRecord/model';
import useStatusMetadata from '@/renderer/hooks/useStatusMetadata';
import useUISelector from '@/renderer/hooks/useUISelector';
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
    const idleStatus = statusMetadata.interactionType === UIDesignToolInteractionType.idle;
    const drawingStatus = statusMetadata.interactionType === UIDesignToolInteractionType.drawing;
    const transformingStatus = statusMetadata.interactionType === UIDesignToolInteractionType.transform;
    const resizingStatus = transformingStatus && statusMetadata.transformMethod === UIDesignToolTransformMethod.resize;
    const rotatingStatus = transformingStatus && statusMetadata.transformMethod === UIDesignToolTransformMethod.rotate;

    const handleVisible = idleStatus;
    const infoVisible = drawingStatus || resizingStatus || rotatingStatus;
    const outlineVisible = idleStatus || drawingStatus || resizingStatus || rotatingStatus;
    const cursorVisible = drawingStatus || transformingStatus;

    return {
      idle: idleStatus,
      drawing: drawingStatus,
      transforming: transformingStatus,
      resizing: resizingStatus,
      rotating: rotatingStatus,
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
      return rect != null ? `${Number(rect.width.toFixed(2))} × ${Number(rect.height.toFixed(2))}` : '';
    },
    [uiSelector],
  );

  const createDegreesInfoText = useCallback(
    (record: UIRecord) => {
      const element = uiSelector.query({ key: record.key });
      /** @todo 우측 패널도 `Layer.rotate.length` 대신 `UIRecordRect.fromElement(element).rotate` 가 노출되어야 함 (데이터를 nested·combined 값으로 조작하면 잦은 변경이 발생하므로 rotate 값만 예외 케이스로 적절한 설계 필요) */
      const rect = element != null ? UIRecordRect.fromElement(element) : undefined;
      return rect != null ? `${Number(toDegrees360(rect.rotate).toFixed(2))}°` : '';
    },
    [uiSelector],
  );

  const getRootStyle = useCallback(
    (record: UIRecord): React.CSSProperties => {
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
      return meta.drawing || meta.resizing ? createSizeInfoText(record) : meta.rotating ? createDegreesInfoText(record) : initialInfoText;
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
