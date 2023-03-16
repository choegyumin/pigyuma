import ColorPicker from '@pigyuma/design-system/components/ColorPicker';
import NumberField from '@pigyuma/design-system/components/NumberField';
import Select from '@pigyuma/design-system/components/Select';
import { SelectValue } from '@pigyuma/design-system/primitives/Select';
import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { StrokeStylePattern } from '@pigyuma/ui-design-tool/types/Unit';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerStrokeSection.css';
import { LayerStrokeSectionProps, LayerStrokeSectionRef } from './types';

const LayerStrokeSection = React.forwardRef<LayerStrokeSectionRef, LayerStrokeSectionProps>((props, ref) => {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isShapeLayer = ShapeLayer.isModel(uiRecord);

  const canEdit = hasUIRecord && isShapeLayer;

  const strokeColor = isShapeLayer ? uiRecord.stroke.color : '';
  const strokePattern = isShapeLayer ? uiRecord.stroke.pattern : '';
  const strokeWidth = isShapeLayer ? uiRecord.stroke.width : { top: 0, right: 0, bottom: 0, left: 0 };

  const onStrokeColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!canEdit) {
      return;
    }
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { color } });
  });

  const onStrokePatternChange = useEvent(
    (event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null, selected: SelectValue | null) => {
      if (!canEdit || selected == null) {
        return;
      }
      const pattern = selected as StrokeStylePattern;
      uiController.set<ShapeLayer>(uiRecord.key, { stroke: { pattern } });
    },
  );

  const onStrokeTopWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const top = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { top } } });
  });

  const onStrokeRightWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const right = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { right } } });
  });

  const onStrokeBottomWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const bottom = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { bottom } } });
  });

  const onStrokeLeftWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const left = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { left } } });
  });

  return (
    <Panel.Group as="div" {...props} ref={ref} className={clsx(styles.root, props.className)} heading="Stroke">
      <LayerFieldset>
        <LayerField label="Color">
          <ColorPicker value={strokeColor} onChange={onStrokeColorChange} disabled={!canEdit} />
        </LayerField>
        <LayerField label="Pattern">
          <Select name="strokePattern" value={strokePattern} onChange={onStrokePatternChange} disabled={!canEdit}>
            <Select.Item value="solid">Solid</Select.Item>
            <Select.Item value="dashed">Dashed</Select.Item>
            <Select.Item value="dotted">Dotted</Select.Item>
            <Select.Item value="double">Double</Select.Item>
          </Select>
        </LayerField>
        <LayerField label="Width">
          Top
          <NumberField autoSelect={true} min={0} value={strokeWidth.top} onChange={onStrokeTopWidthChange} disabled={!canEdit} />
          Right
          <NumberField autoSelect={true} min={0} value={strokeWidth.right} onChange={onStrokeRightWidthChange} disabled={!canEdit} />
          Bottom
          <NumberField autoSelect={true} min={0} value={strokeWidth.bottom} onChange={onStrokeBottomWidthChange} disabled={!canEdit} />
          Left
          <NumberField autoSelect={true} min={0} value={strokeWidth.left} onChange={onStrokeLeftWidthChange} disabled={!canEdit} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerStrokeSection.displayName = 'LayerStrokeSection';

export default LayerStrokeSection;
