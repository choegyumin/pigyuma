import { UIRecordKey } from '@/types/Identifier';
import { UIRecordRect } from '@/types/Shape';
import { useCallback } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './SelectionOverlay.css';
import { SelectionOverlayProps, SelectionOverlayRef } from './types';
import { UseDataType } from './useData';

export type UseUIControllerDependencys = {
  api: UIDesignToolAPI;
  props: SelectionOverlayProps;
  ref: React.ForwardedRef<SelectionOverlayRef>;
  data: UseDataType;
};

export default function useUIController(deps: UseUIControllerDependencys) {
  const {
    api,
    data: { setRootStyle, setActive },
  } = deps;

  /** @todo rotate 값이 조상 엘리먼트를 고려하도록 개선 (트리를 읽어 계산된 값을 추출하는 API 구현) */
  const getOverlayShapeStyle = useCallback(
    (recordKey: UIRecordKey) => {
      const element = api.query({ key: recordKey });
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
    [api],
  );

  const setOverlayShapeStyle = useCallback(
    (recordKey: UIRecordKey) => {
      setRootStyle(getOverlayShapeStyle(recordKey));
    },
    [setRootStyle, getOverlayShapeStyle],
  );

  const showUI = useCallback(() => {
    setActive(true);
    setRootStyle({
      [styles.varNames.visibility]: 'visible',
    });
  }, [setRootStyle, setActive]);

  const hideUI = useCallback(() => {
    setActive(false);
    setRootStyle({
      [styles.varNames.visibility]: 'hidden',
    });
  }, [setRootStyle, setActive]);

  return {
    getOverlayShapeStyle,
    setOverlayShapeStyle,
    showUI,
    hideUI,
  };
}

export type UseUIControllerType = ReturnType<typeof useUIController>;
