import NumberField from '@pigyuma/design-system/components/NumberField';
import mixins from '@pigyuma/design-system/mixins';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerTransformSection.css';
import { LayerTransformSectionProps, LayerTransformSectionRef } from './types';
import useLayerTransformSection from './useLayerTransformSection';

const LayerTransformSection = React.forwardRef<LayerTransformSectionRef, LayerTransformSectionProps>((props, ref) => {
  const viewModel = useLayerTransformSection(props, ref);
  if (viewModel == null) {
    return null;
  }

  const {
    canEditPosition,
    canEditSize,
    canEditRotate,
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
    <Panel.Group as="div" {...restProps} ref={ref} className={clsx(styles.root, className)}>
      <h2 className={mixins.blind}>Transform</h2>
      <LayerFieldset>
        <LayerField label="X">
          <NumberField autoSelect={true} value={x} onChange={onXLengthChange} disabled={!canEditPosition} />
        </LayerField>
        <LayerField label="Y">
          <NumberField autoSelect={true} value={y} onChange={onYLengthChange} disabled={!canEditPosition} />
        </LayerField>
        <LayerField label="Width">
          <NumberField autoSelect={true} min={1} value={width} onChange={onWidthLengthChange} disabled={!canEditSize} />
        </LayerField>
        <LayerField label="Height">
          <NumberField autoSelect={true} min={1} value={height} onChange={onHeightLengthChange} disabled={!canEditSize} />
        </LayerField>
        <LayerField label="Rotate">
          <NumberField autoSelect={true} value={rotate} onChange={onRotateDegChange} disabled={!canEditRotate} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerTransformSection.displayName = 'LayerTransformSection';

export default LayerTransformSection;
