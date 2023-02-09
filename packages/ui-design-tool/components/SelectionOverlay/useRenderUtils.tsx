import { UIRecordRect } from '@/types/Geometry';
import { Layer } from '@/ui-models/Layer/model';
import { UIRecord } from '@/ui-models/UIRecord/model';
import { useCallback } from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import * as styles from './SelectionOverlay.css';

export type UseRenderUtilsDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

const initialStyle = {
  [styles.varNames.x]: 0,
  [styles.varNames.y]: 0,
  [styles.varNames.width]: 0,
  [styles.varNames.height]: 0,
  [styles.varNames.rotate]: 0,
  [styles.varNames.visibility]: 'hidden',
};

export default function useRenderUtils(deps: UseRenderUtilsDependencys) {
  const { context } = deps;

  const getRootStyle = useCallback(
    (record: UIRecord) => {
      if (!(record instanceof Layer)) {
        return initialStyle;
      }

      const layerElement = context.query({ key: record.key });
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
    [context],
  );

  return { getRootStyle };
}

export type UseRenderUtilsType = ReturnType<typeof useRenderUtils>;
