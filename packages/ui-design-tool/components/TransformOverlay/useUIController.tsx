import { UIRecordRect } from '@/types/Shape';
import { UIRecordStyle } from '@/types/Style';
import { getUIRecordStyleValue, setUIRecordStyleValue } from '@/utils/style';
import { useCallback } from 'react';
import * as styles from './TransformOverlay.css';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';

export type UseUIControllerDependencys = {
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
};

export default function useUIController(deps: UseUIControllerDependencys) {
  const {
    data: { setRootStyle },
  } = deps;

  const getLayerShapeStyle = useCallback((layer: HTMLElement) => {
    return {
      x: getUIRecordStyleValue(layer, UIRecordStyle.x),
      y: getUIRecordStyleValue(layer, UIRecordStyle.y),
      width: getUIRecordStyleValue(layer, UIRecordStyle.width),
      height: getUIRecordStyleValue(layer, UIRecordStyle.height),
      degrees: getUIRecordStyleValue(layer, UIRecordStyle.degrees),
    };
  }, []);

  const getOverlayShapeStyle = useCallback((layer: HTMLElement) => {
    const { x, y, width, height, degrees } = UIRecordRect.fromElement(layer);
    return {
      // resize, rotate를 고려해 중심축을 기준으로 함
      x: `${x + width / 2}px`,
      y: `${y + height / 2}px`,
      width: `${width}px`,
      height: `${height}px`,
      degrees: `${degrees}deg`,
    };
  }, []);

  const setOverlayShapeStyle = useCallback(
    (layer: HTMLElement | null) => {
      const shape = layer != null ? getOverlayShapeStyle(layer) : { x: 0, y: 0, width: 0, height: 0, degrees: 0 };
      setRootStyle({
        [styles.varNames.x]: shape.x,
        [styles.varNames.y]: shape.y,
        [styles.varNames.width]: shape.width,
        [styles.varNames.height]: shape.height,
        [styles.varNames.degrees]: shape.degrees,
      });
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

  const switchIdleUI = useCallback(() => {
    /** @todo 별도의 API로 구현 (onMouseUpForSelection 참고) */
    document.body.style.setProperty('pointer-events', null);
    setRootStyle({
      [styles.varNames.outlineOpacity]: 0,
      [styles.varNames.resizeHandleOpacity]: 0,
      [styles.varNames.transformOpacity]: 0,
    });
  }, [setRootStyle]);

  const switchSelectedUI = useCallback(() => {
    /** @todo 별도의 API로 구현 (onMouseUpForSelection 참고) */
    document.body.style.setProperty('pointer-events', null);
    setRootStyle({
      [styles.varNames.outlineOpacity]: 1,
      [styles.varNames.resizeHandleOpacity]: 1,
      [styles.varNames.transformOpacity]: 0,
    });
  }, [setRootStyle]);

  const switchTransformUI = useCallback(() => {
    /** @todo 별도의 API로 구현 (onMouseUpForSelection 참고) */
    document.body.style.setProperty('pointer-events', 'none');
    setRootStyle({
      [styles.varNames.outlineOpacity]: 0,
      [styles.varNames.resizeHandleOpacity]: 0,
      [styles.varNames.transformOpacity]: 1,
    });
  }, [setRootStyle]);

  const transformLayer = useCallback(
    (
      layer: HTMLElement,
      style: { x?: string | null; y?: string | null; width?: string | null; height?: string | null; degrees?: string | null },
    ) => {
      Object.entries(style).forEach(([key, value]) => {
        /** @todo records 데이터를 직접 편집하도록 개선 (추후 History 관리) */
        setUIRecordStyleValue(layer, UIRecordStyle[key], value);
      });
      setOverlayShapeStyle(layer);
    },
    [setOverlayShapeStyle],
  );

  return {
    getLayerShapeStyle,
    getOverlayShapeStyle,
    setOverlayShapeStyle,
    showUI,
    hideUI,
    switchIdleUI,
    switchSelectedUI,
    switchTransformUI,
    transformLayer,
  };
}

export type UseUIControllerType = ReturnType<typeof useUIController>;
