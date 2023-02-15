import { Layer } from '@/api/Layer/model';
import { UIRecord } from '@/api/UIRecord/model';
import { UIRecordQuad } from '@/types/Geometry';
import { UIRecordType } from '@/types/Identifier';
import { hasUIRecordParent } from '@/utils/model';
import { useCallback } from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import * as styles from './AxisGrid.css';

export type UseRenderUtilsDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

const initialStyle = {
  [styles.varNames.x]: 0,
  [styles.varNames.y]: 0,
  [styles.varNames.axisXLeft]: 'unset',
  [styles.varNames.axisXRight]: 'unset',
  [styles.varNames.axisXLength]: 0,
  [styles.varNames.axisYTop]: 'unset',
  [styles.varNames.axisYBottom]: 'unset',
  [styles.varNames.axisYLength]: 0,
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

      const { x: layerX, y: layerY, width: layerWidth, height: layerHeight } = UIRecordQuad.fromElement(layerElement).getBounds();
      const axisX = layerX + layerWidth / 2;
      const axisY = layerY + layerHeight / 2;

      const styleValues = {} as React.CSSProperties;
      styleValues[styles.varNames.visibility] = 'visible';
      styleValues[styles.varNames.x] = `${axisX}px`;
      styleValues[styles.varNames.y] = `${axisY}px`;
      styleValues[styles.varNames.axisXLeft] = 'unset';
      styleValues[styles.varNames.axisXRight] = 'unset';
      styleValues[styles.varNames.axisXLength] = 0;
      styleValues[styles.varNames.axisYTop] = 'unset';
      styleValues[styles.varNames.axisYBottom] = 'unset';
      styleValues[styles.varNames.axisYLength] = 0;

      const artboardRecord = hasUIRecordParent(record) ? record.parent : null;
      const artboardElement = layerElement.parentElement;
      if (artboardRecord == null || artboardElement == null || !context.matches(artboardElement, { type: UIRecordType.artboard })) {
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
    [context],
  );

  return { getRootStyle };
}

export type UseRenderUtilsType = ReturnType<typeof useRenderUtils>;
