import NumberField from '@pigyuma/design-system/components/NumberField';
import mixins from '@pigyuma/design-system/mixins';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerTransformSection.css';
import { LayerTransformSectionElementType, LayerTransformSectionProps, LayerTransformSectionRefInstance } from './types';
import useLayerTransformSection from './useLayerTransformSection';

const LayerTransformSection = React.forwardRef<LayerTransformSectionRefInstance, LayerTransformSectionProps>((props, ref) => {
  const viewModel = useLayerTransformSection(props, ref);

  const {
    positionEditable,
    sizeEditable,
    rotateEditable,
    x,
    y,
    width,
    height,
    rotate,
    onXLengthChange,
    onYLengthChange,
    onWidthLengthChange,
    onHeightLengthChange,
    onRotateDegChange,
  } = viewModel;
  const { selected, className, ...restProps } = props;

  return (
    <Panel.Group {...restProps} ref={ref} as={LayerTransformSectionElementType} className={clsx(styles.root, className)}>
      <h2 className={mixins.blind}>Transform</h2>
      <LayerFieldset>
        <LayerField label="X">
          <NumberField autoSelect={true} value={x} onChange={onXLengthChange} disabled={!positionEditable} />
        </LayerField>
        <LayerField label="Y">
          <NumberField autoSelect={true} value={y} onChange={onYLengthChange} disabled={!positionEditable} />
        </LayerField>
        <LayerField label="Width">
          <NumberField autoSelect={true} min={1} value={width} onChange={onWidthLengthChange} disabled={!sizeEditable} />
        </LayerField>
        <LayerField label="Height">
          <NumberField autoSelect={true} min={1} value={height} onChange={onHeightLengthChange} disabled={!sizeEditable} />
        </LayerField>
        <LayerField label="Rotate">
          <NumberField autoSelect={true} value={rotate} onChange={onRotateDegChange} disabled={!rotateEditable} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerTransformSection.displayName = 'LayerTransformSection';

export default LayerTransformSection;
