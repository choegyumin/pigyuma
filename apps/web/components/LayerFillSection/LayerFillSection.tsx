import ColorPicker from '@pigyuma/design-system/components/ColorPicker';
import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerFillSection.css';
import { LayerFillSectionProps, LayerFillSectionRef } from './types';

const LayerFillSection = React.forwardRef<LayerFillSectionRef, LayerFillSectionProps>((props, ref) => {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isArtboard = Artboard.isModel(uiRecord);
  const isShapeLayer = ShapeLayer.isModel(uiRecord);

  const canEdit = hasUIRecord && (isArtboard || isShapeLayer);

  const fillColor = isArtboard ? uiRecord.fill : isShapeLayer ? uiRecord.fill.color : '';

  const onFillColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!canEdit) {
      return;
    }
    if (isArtboard) {
      uiController.set<Artboard>(uiRecord.key, { fill: color });
    } else {
      uiController.set<ShapeLayer>(uiRecord.key, { fill: { color } });
    }
  });

  return (
    <Panel.Group as="div" {...props} ref={ref} className={clsx(styles.root, props.className)} heading="Fill">
      <LayerFieldset>
        <LayerField label="Color">
          <ColorPicker value={fillColor} onChange={onFillColorChange} disabled={!canEdit} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerFillSection.displayName = 'LayerFillSection';

export default LayerFillSection;
