import ColorPicker from '@pigyuma/design-system/components/ColorPicker';
import NumberField from '@pigyuma/design-system/components/NumberField';
import Select from '@pigyuma/design-system/components/Select';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerStrokeSection.css';
import { LayerStrokeSectionElementType, LayerStrokeSectionProps, LayerStrokeSectionRefInstance } from './types';
import useLayerStrokeSection from './useLayerStrokeSection';

const LayerStrokeSection = React.forwardRef<LayerStrokeSectionRefInstance, LayerStrokeSectionProps>((props, ref) => {
  const viewModel = useLayerStrokeSection(props, ref);

  const {
    editable,
    strokeColor,
    strokePattern,
    strokeWidth,
    onStrokeColorChange,
    onStrokePatternChange,
    onStrokeTopWidthChange,
    onStrokeRightWidthChange,
    onStrokeBottomWidthChange,
    onStrokeLeftWidthChange,
  } = viewModel;
  const { selected, className, ...restProps } = props;

  return (
    <Panel.Group {...restProps} ref={ref} as={LayerStrokeSectionElementType} className={clsx(styles.root, className)} heading="Stroke">
      <LayerFieldset>
        <LayerField label="Color">
          <ColorPicker value={strokeColor} onChange={onStrokeColorChange} disabled={!editable} />
        </LayerField>
        <LayerField label="Pattern">
          <Select name="strokePattern" value={strokePattern} onChange={onStrokePatternChange} disabled={!editable}>
            <Select.Item value="solid">Solid</Select.Item>
            <Select.Item value="dashed">Dashed</Select.Item>
            <Select.Item value="dotted">Dotted</Select.Item>
            <Select.Item value="double">Double</Select.Item>
          </Select>
        </LayerField>
        <LayerField label="Width">
          Top
          <NumberField autoSelect={true} min={0} value={strokeWidth.top} onChange={onStrokeTopWidthChange} disabled={!editable} />
          Right
          <NumberField autoSelect={true} min={0} value={strokeWidth.right} onChange={onStrokeRightWidthChange} disabled={!editable} />
          Bottom
          <NumberField autoSelect={true} min={0} value={strokeWidth.bottom} onChange={onStrokeBottomWidthChange} disabled={!editable} />
          Left
          <NumberField autoSelect={true} min={0} value={strokeWidth.left} onChange={onStrokeLeftWidthChange} disabled={!editable} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerStrokeSection.displayName = 'LayerStrokeSection';

export default LayerStrokeSection;
