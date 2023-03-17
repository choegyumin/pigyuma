import { Artboard, ShapeLayer, TextLayer, useUIData } from '@pigyuma/ui-design-tool';
import clsx from 'clsx';
import React from 'react';
import LayerFillSection from '../LayerFillSection';
import LayerStrokeSection from '../LayerStrokeSection';
import LayerTransformSection from '../LayerTransformSection';
import LayerTypographySection from '../LayerTypographySection';
import Panel from '../Panel';
import * as styles from './ControlPanel.css';
import { ControlPanelProps, ControlPanelRef } from './types';

const ControlPanel = React.forwardRef<ControlPanelRef, ControlPanelProps>((props, ref) => {
  const uiData = useUIData();
  const selectedRecord = uiData.get([...uiData.selected][0]);

  const hasUIRecord = selectedRecord != null;

  const isArtboard = Artboard.isModel(selectedRecord);
  const isShapeLayer = ShapeLayer.isModel(selectedRecord);
  const isTextLayer = TextLayer.isModel(selectedRecord);

  const canEditFill = hasUIRecord && (isArtboard || isShapeLayer);
  const canEditStroke = hasUIRecord && isShapeLayer;
  const canEditTypography = hasUIRecord && isTextLayer;

  return (
    <Panel {...props} ref={ref} as="div" role="toolbar" className={clsx(styles.root, props.className)} placement="right">
      <LayerTransformSection selected={selectedRecord?.key} />
      {canEditFill && <LayerFillSection selected={selectedRecord?.key} />}
      {canEditStroke && <LayerStrokeSection selected={selectedRecord?.key} />}
      {canEditTypography && <LayerTypographySection selected={selectedRecord?.key} />}
    </Panel>
  );
});
ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
