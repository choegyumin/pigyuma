import clsx from 'clsx';
import React from 'react';
import LayerFillSection from '../LayerFillSection';
import LayerStrokeSection from '../LayerStrokeSection';
import LayerTransformSection from '../LayerTransformSection';
import LayerTypographySection from '../LayerTypographySection';
import Panel from '../Panel';
import * as styles from './ControlPanel.css';
import { ControlPanelProps, ControlPanelRef } from './types';
import useControlPanel from './useControlPanel';

const ControlPanel = React.forwardRef<ControlPanelRef, ControlPanelProps>((props, ref) => {
  const viewModel = useControlPanel(props, ref);

  const { selectedRecord, fillEditable, strokeEditable, typographyEditable } = viewModel;

  return (
    <Panel {...props} ref={ref} as="div" role="toolbar" className={clsx(styles.root, props.className)} placement="right">
      <LayerTransformSection selected={selectedRecord?.key} />
      {fillEditable && <LayerFillSection selected={selectedRecord?.key} />}
      {strokeEditable && <LayerStrokeSection selected={selectedRecord?.key} />}
      {typographyEditable && <LayerTypographySection selected={selectedRecord?.key} />}
    </Panel>
  );
});
ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
