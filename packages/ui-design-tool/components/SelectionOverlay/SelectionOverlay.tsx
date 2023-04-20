import { HandlePlacement, InteractionHandleType, UIInteractionElementDataAttributeName } from '@/types/Identifier';
import clsx from 'clsx';
import React from 'react';
import * as styles from './SelectionOverlay.css';
import useSelectionOverlay from './useSelectionOverlay';

export const SelectionOverlay: React.FC = React.memo(() => {
  const viewModel = useSelectionOverlay();
  if (viewModel == null) {
    return null;
  }

  const { isRotatable, isResizable, rootStyle, infoText, resizeHandleCursorMap, rotateHandleCursorMap } = viewModel;

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.wrapper}>
        <div className={styles.outline} />
        {isResizable &&
          (['top', 'right', 'bottom', 'left'] as const).map((cursor) => (
            <div
              key={cursor}
              {...{
                [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
                [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement[cursor],
              }}
              className={clsx(styles.resizeHandle, styles.resizeHandle_placement[cursor])}
              style={{ cursor: resizeHandleCursorMap[cursor] }}
            />
          ))}
        {isRotatable &&
          (['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const).map((cursor) => (
            <div
              key={cursor}
              {...{
                [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.rotate,
                [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement[cursor],
              }}
              className={clsx(styles.rotateHandle, styles.rotateHandle_placement[cursor])}
              style={{ cursor: rotateHandleCursorMap[cursor] }}
            />
          ))}
        {isResizable &&
          (['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const).map((cursor) => (
            <div
              key={cursor}
              {...{
                [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
                [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement[cursor],
              }}
              className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle_placement[cursor])}
              style={{ cursor: resizeHandleCursorMap[cursor] }}
            />
          ))}
      </div>
      <div className={styles.info}>{infoText}</div>
    </div>
  );
});
SelectionOverlay.displayName = 'SelectionOverlay';
