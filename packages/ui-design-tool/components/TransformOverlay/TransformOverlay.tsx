import useSelected from '@/hooks/useSelected';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { UIInteractionElementDataAttributeName } from '@/types/Identifier';
import clsx from 'clsx';
import React from 'react';
import * as styles from './TransformOverlay.css';
import { HandlePlacement } from './types';
import useRenderUtils from './useRenderUtils';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const TransformOverlay: React.FC = React.memo(() => {
  const selected = useSelected();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils();

  const isActive = record != null && selected.size > 0;

  if (!isActive) {
    return null;
  }

  const rootStyle = getRootStyle(record);
  const infoText = getInfoText(record);
  const resizeHandleCursorMap = getResizeHandleCursorMap(record);
  const rotateHandleCursorMap = getRotateHandleCursorMap(record);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.wrapper}>
        <div className={styles.outline} />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topLeft,
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.topLeft)}
          style={{ cursor: rotateHandleCursorMap.topLeft }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topRight,
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.topRight)}
          style={{ cursor: rotateHandleCursorMap.topRight }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomRight,
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.bottomRight)}
          style={{ cursor: rotateHandleCursorMap.bottomRight }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'rotate',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomLeft,
          }}
          className={clsx(styles.rotateHandle, styles.rotateHandle$.bottomLeft)}
          style={{ cursor: rotateHandleCursorMap.bottomLeft }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.top,
          }}
          className={clsx(styles.resizeHandle, styles.resizeHandle$.top)}
          style={{ cursor: resizeHandleCursorMap.top }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.right,
          }}
          className={clsx(styles.resizeHandle, styles.resizeHandle$.right)}
          style={{ cursor: resizeHandleCursorMap.right }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottom,
          }}
          className={clsx(styles.resizeHandle, styles.resizeHandle$.bottom)}
          style={{ cursor: resizeHandleCursorMap.bottom }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.left,
          }}
          className={clsx(styles.resizeHandle, styles.resizeHandle$.left)}
          style={{ cursor: resizeHandleCursorMap.left }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topLeft,
          }}
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.topLeft)}
          style={{ cursor: resizeHandleCursorMap.topLeft }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topRight,
          }}
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.topRight)}
          style={{ cursor: resizeHandleCursorMap.topRight }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomRight,
          }}
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.bottomRight)}
          style={{ cursor: resizeHandleCursorMap.bottomRight }}
        />
        <div
          {...{
            [UIInteractionElementDataAttributeName.handleType]: 'resize',
            [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomLeft,
          }}
          className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle$.bottomLeft)}
          style={{ cursor: resizeHandleCursorMap.bottomLeft }}
        />
      </div>
      <div className={styles.info}>{infoText}</div>
    </div>
  );
});
TransformOverlay.displayName = 'TransformOverlay';
