import { UIRecordLayoutRect } from '@/types/Shape';
import { useCallback } from 'react';
import * as styles from './HoveringOverlay.css';
import { HoveringOverlayProps, HoveringOverlayRef } from './types';
import { UseDataType } from './useData';

export type UseUIControllerDependencys = {
  props: HoveringOverlayProps;
  ref: React.ForwardedRef<HoveringOverlayRef>;
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
          [styles.varNames.width]: 0,
          [styles.varNames.height]: 0,
          [styles.varNames.degrees]: 0,
        });
        return;
      }

      const { x, y, width, height, degrees } = UIRecordLayoutRect.fromElement(layer);
      setRootStyle({
        // resize, rotate를 고려해 중심축을 기준으로 함
        [styles.varNames.x]: `${x + width / 2}px`,
        [styles.varNames.y]: `${y + height / 2}px`,
        [styles.varNames.width]: `${width}px`,
        [styles.varNames.height]: `${height}px`,
        [styles.varNames.degrees]: `${degrees}deg`,
      });
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
