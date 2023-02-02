import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIRecordQuad } from '@/types/Shape';
import { hasUIRecordParent } from '@/utils/model';
import { useCallback } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './AxisGrid.css';
import { AxisGridProps, AxisGridRef } from './types';
import { UseDataType } from './useData';

export type UseUIControllerDependencys = {
  api: UIDesignToolAPI;
  props: AxisGridProps;
  ref: React.ForwardedRef<AxisGridRef>;
  data: UseDataType;
};

export default function useUIController(deps: UseUIControllerDependencys) {
  const {
    api,
    data: { setRootStyle },
  } = deps;

  const getOverlayShapeStyle = useCallback(
    (recordKey: UIRecordKey) => {
      const layerRecord = api.get(recordKey);
      const layerElement = api.query({ key: recordKey });
      if (layerElement == null) {
        console.warn(`element not found with key ${recordKey}.`);
        return {
          [styles.varNames.x]: 0,
          [styles.varNames.y]: 0,
          [styles.varNames.axisXLeft]: 'unset',
          [styles.varNames.axisXRight]: 'unset',
          [styles.varNames.axisXLength]: 0,
          [styles.varNames.axisYTop]: 'unset',
          [styles.varNames.axisYBottom]: 'unset',
          [styles.varNames.axisYLength]: 0,
        };
      }

      const { x: layerX, y: layerY, width: layerWidth, height: layerHeight } = UIRecordQuad.fromElement(layerElement).getBounds();
      const axisX = layerX + layerWidth / 2;
      const axisY = layerY + layerHeight / 2;

      const styleValues = {} as React.CSSProperties;
      styleValues[styles.varNames.x] = `${axisX}px`;
      styleValues[styles.varNames.y] = `${axisY}px`;
      styleValues[styles.varNames.axisXLeft] = 'unset';
      styleValues[styles.varNames.axisXRight] = 'unset';
      styleValues[styles.varNames.axisXLength] = 0;
      styleValues[styles.varNames.axisYTop] = 'unset';
      styleValues[styles.varNames.axisYBottom] = 'unset';
      styleValues[styles.varNames.axisYLength] = 0;

      const artboardRecord = hasUIRecordParent(layerRecord) ? layerRecord.parent : null;
      const artboardElement = layerElement.parentElement;
      if (artboardRecord == null || artboardElement == null || !api.matches(artboardElement, { type: UIRecordType.artboard })) {
        return styleValues;
      }

      const { x: artboardX, y: artboardY } = UIRecordQuad.fromElement(artboardElement).getBounds();
      const axisLength = {
        x: axisX - artboardX,
        y: axisY - artboardY,
      };

      /** @todo 레이어의 포지셔닝 기준축에 따라 눈금선 위치 변경 (right or left, bottom or top)  */
      styleValues[styles.varNames.axisXLength] = `${axisLength.x}px`;
      styleValues[styles.varNames.axisYLength] = `${axisLength.y}px`;
      if (axisLength.x < 0) {
        styleValues[styles.varNames.axisXLeft] = '0%';
        styleValues[styles.varNames.axisXLength] = `${-axisLength.x}px`;
      } else {
        styleValues[styles.varNames.axisXRight] = '100%';
      }
      if (axisLength.y < 0) {
        styleValues[styles.varNames.axisYTop] = '0%';
        styleValues[styles.varNames.axisYLength] = `${-axisLength.y}px`;
      } else {
        styleValues[styles.varNames.axisYBottom] = '100%';
      }

      return styleValues;
    },
    [api],
  );

  const setOverlayShapeStyle = useCallback(
    (recordKey: UIRecordKey) => {
      setRootStyle(getOverlayShapeStyle(recordKey));
    },
    [setRootStyle, getOverlayShapeStyle],
  );

  const showUI = useCallback(() => {
    setRootStyle({
      [styles.varNames.visibility]: 'visible',
    });
  }, [setRootStyle]);

  const hideUI = useCallback(() => {
    setRootStyle({
      [styles.varNames.visibility]: 'hidden',
    });
  }, [setRootStyle]);

  return {
    getOverlayShapeStyle,
    setOverlayShapeStyle,
    showUI,
    hideUI,
  };
}

export type UseUIControllerType = ReturnType<typeof useUIController>;
