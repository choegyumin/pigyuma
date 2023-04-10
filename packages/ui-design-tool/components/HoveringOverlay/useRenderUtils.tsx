import { Layer } from '@/api/Layer/model';
import { UIRecord } from '@/api/UIRecord/model';
import useUISelector from '@/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import { useCallback } from 'react';
import * as styles from './HoveringOverlay.css';

const initialStyle = {
  [styles.varNames.x]: 0,
  [styles.varNames.y]: 0,
  [styles.varNames.width]: 0,
  [styles.varNames.height]: 0,
  [styles.varNames.rotate]: 0,
  [styles.varNames.visibility]: 'hidden',
};

export default function useRenderUtils() {
  const uiSelector = useUISelector();

  const getRootStyle = useCallback(
    (record: UIRecord): React.CSSProperties => {
      if (!(record instanceof Layer)) {
        return initialStyle;
      }

      const layerElement = uiSelector.query({ key: record.key });
      if (layerElement == null) {
        console.error(`element not found with key ${record.key}.`);
        return initialStyle;
      }

      const { x, y, width, height, rotate } = UIRecordRect.fromElement(layerElement);
      // resize, rotate를 고려해 x, y를 중심축으로 설정
      return {
        [styles.varNames.visibility]: 'visible',
        [styles.varNames.x]: `${x + width / 2}px`,
        [styles.varNames.y]: `${y + height / 2}px`,
        [styles.varNames.width]: `${width}px`,
        [styles.varNames.height]: `${height}px`,
        [styles.varNames.rotate]: `${rotate}deg`,
      };
    },
    [uiSelector],
  );

  return { getRootStyle };
}

export type UseRenderUtilsType = ReturnType<typeof useRenderUtils>;
