import { Artboard, ShapeLayer, TextLayer, useUIData } from '@pigyuma/ui-design-tool';
import React from 'react';
import { ControlPanelProps, ControlPanelRef } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useControlPanel(props: ControlPanelProps, ref: React.ForwardedRef<ControlPanelRef>) {
  const uiData = useUIData();
  const selectedRecord = uiData.get([...uiData.selected][0]);

  const hasUIRecord = selectedRecord != null;

  const isArtboard = Artboard.isModel(selectedRecord);
  const isShapeLayer = ShapeLayer.isModel(selectedRecord);
  const isTextLayer = TextLayer.isModel(selectedRecord);

  const canEditFill = hasUIRecord && (isArtboard || isShapeLayer);
  const canEditStroke = hasUIRecord && isShapeLayer;
  const canEditTypography = hasUIRecord && isTextLayer;

  return { selectedRecord, canEditFill, canEditStroke, canEditTypography };
}
