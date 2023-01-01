import { UIRecordBoundingRect } from '@/types/Shape';
import { useCallback } from 'react';
import * as styles from './AxisGrid.css';
import { AxisGridProps, AxisGridRef } from './types';
import { UseDataType } from './useData';

export type UseUIControllerDependencys = {
  props: AxisGridProps;
  ref: React.ForwardedRef<AxisGridRef>;
  data: UseDataType;
};

export default function useUIController(deps: UseUIControllerDependencys) {
  const {
    data: { setRootStyle },
  } = deps;

  const setOverlayShapeStyle = useCallback(
    (layer: HTMLElement | null) => {
      if (layer == null) {
        setRootStyle({
          [styles.varNames.x]: 0,
          [styles.varNames.y]: 0,
          [styles.varNames.axisXLeft]: 'unset',
          [styles.varNames.axisXRight]: 'unset',
          [styles.varNames.axisXLength]: 0,
          [styles.varNames.axisYTop]: 'unset',
          [styles.varNames.axisYBottom]: 'unset',
          [styles.varNames.axisYLength]: 0,
        });
        return;
      }

      const { x: layerX, y: layerY, width: layerWidth, height: layerHeight } = UIRecordBoundingRect.fromElement(layer);
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

      const artboard = layer.parentElement;
      if (artboard == null || !artboard.matches('[data-ui-name="artboard"]')) {
        setRootStyle(styleValues);
        return;
      }

      const { x: artboardX, y: artboardY } = UIRecordBoundingRect.fromElement(artboard);
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

      setRootStyle(styleValues);
    },
    [setRootStyle],
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
    setOverlayShapeStyle,
    showUI,
    hideUI,
  };
}

export type UseUIControllerType = ReturnType<typeof useUIController>;
