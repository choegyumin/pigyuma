import ColorPicker from '@pigyuma/design-system/components/ColorPicker';
import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerTypographySection.css';
import { LayerTypographySectionProps, LayerTypographySectionRef } from './types';

const LayerTypographySection = React.forwardRef<LayerTypographySectionRef, LayerTypographySectionProps>((props, ref) => {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isTextLayer = TextLayer.isModel(uiRecord);

  const canEdit = hasUIRecord && isTextLayer;

  const textColor = isTextLayer ? uiRecord.textColor.color : '';

  const onTextColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!canEdit) {
      return;
    }
    uiController.set<TextLayer>(uiRecord.key, { textColor: { color } });
  });

  return (
    <Panel.Group as="div" {...props} ref={ref} className={clsx(styles.root, props.className)} heading="Typography">
      <LayerFieldset>
        <LayerField label="Color">
          <ColorPicker value={textColor} onChange={onTextColorChange} disabled={!canEdit} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerTypographySection.displayName = 'LayerTypographySection';

export default LayerTypographySection;
