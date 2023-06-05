import { Artboard, ShapeLayer, TextLayer, useUIData } from '@pigyuma/ui-design-tool';
import React from 'react';
import { ControlPanelProps, ControlPanelRefInstance } from './types';

export default function useControlPanel(props: ControlPanelProps, ref: React.ForwardedRef<ControlPanelRefInstance>) {
  const uiData = useUIData();
  const selectedRecord = uiData.get([...uiData.selected][0]);

  const uiRecordExists = selectedRecord != null;

  const artboardSelected = selectedRecord instanceof Artboard;
  const shapeLayerSelected = selectedRecord instanceof ShapeLayer;
  const textLayerSelected = selectedRecord instanceof TextLayer;

  const fillEditable = uiRecordExists && (artboardSelected || shapeLayerSelected);
  const strokeEditable = uiRecordExists && shapeLayerSelected;
  const typographyEditable = uiRecordExists && textLayerSelected;

  return { selectedRecord, fillEditable, strokeEditable, typographyEditable };
}
