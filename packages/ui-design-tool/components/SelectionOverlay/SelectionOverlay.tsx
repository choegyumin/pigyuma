import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import useSelected from '@/hooks/useSelected';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { HandlePlacement, InteractionHandleType, UIInteractionElementDataAttributeName } from '@/types/Identifier';
import clsx from 'clsx';
import React from 'react';
import * as styles from './SelectionOverlay.css';
import useRenderUtils from './useRenderUtils';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const SelectionOverlay: React.FC = React.memo(() => {
  const selected = useSelected();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils();

  const isActive = record != null && selected.size > 0;

  if (!isActive) {
    return null;
  }

  const isResizable = isActive && (record instanceof Layer || record instanceof Artboard);
  const isRotatable = isActive && record instanceof Layer;

  const rootStyle = getRootStyle(record);
  const infoText = getInfoText(record);
  const resizeHandleCursorMap = getResizeHandleCursorMap(record);
  const rotateHandleCursorMap = getRotateHandleCursorMap(record);

  const resizeHandles = (
    <>
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.top,
        }}
        className={clsx(styles.resizeHandle, styles.resizeHandle_placement.top)}
        style={{ cursor: resizeHandleCursorMap.top }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.right,
        }}
        className={clsx(styles.resizeHandle, styles.resizeHandle_placement.right)}
        style={{ cursor: resizeHandleCursorMap.right }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottom,
        }}
        className={clsx(styles.resizeHandle, styles.resizeHandle_placement.bottom)}
        style={{ cursor: resizeHandleCursorMap.bottom }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.left,
        }}
        className={clsx(styles.resizeHandle, styles.resizeHandle_placement.left)}
        style={{ cursor: resizeHandleCursorMap.left }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topLeft,
        }}
        className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle_placement.topLeft)}
        style={{ cursor: resizeHandleCursorMap.topLeft }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topRight,
        }}
        className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle_placement.topRight)}
        style={{ cursor: resizeHandleCursorMap.topRight }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomRight,
        }}
        className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle_placement.bottomRight)}
        style={{ cursor: resizeHandleCursorMap.bottomRight }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.resize,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomLeft,
        }}
        className={clsx(styles.resizeCornerHandle, styles.resizeCornerHandle_placement.bottomLeft)}
        style={{ cursor: resizeHandleCursorMap.bottomLeft }}
      />
    </>
  );

  const rotateHandles = (
    <>
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.rotate,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topLeft,
        }}
        className={clsx(styles.rotateHandle, styles.rotateHandle_placement.topLeft)}
        style={{ cursor: rotateHandleCursorMap.topLeft }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.rotate,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.topRight,
        }}
        className={clsx(styles.rotateHandle, styles.rotateHandle_placement.topRight)}
        style={{ cursor: rotateHandleCursorMap.topRight }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.rotate,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomRight,
        }}
        className={clsx(styles.rotateHandle, styles.rotateHandle_placement.bottomRight)}
        style={{ cursor: rotateHandleCursorMap.bottomRight }}
      />
      <div
        {...{
          [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.rotate,
          [UIInteractionElementDataAttributeName.handlePlacement]: HandlePlacement.bottomLeft,
        }}
        className={clsx(styles.rotateHandle, styles.rotateHandle_placement.bottomLeft)}
        style={{ cursor: rotateHandleCursorMap.bottomLeft }}
      />
    </>
  );

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.wrapper}>
        <div className={styles.outline} />
        {isRotatable && rotateHandles}
        {isResizable && resizeHandles}
      </div>
      <div className={styles.info}>{infoText}</div>
    </div>
  );
});
SelectionOverlay.displayName = 'SelectionOverlay';
