import ColorPicker from '@pigyuma/design-system/components/ColorPicker';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerFillSection.css';
import { LayerFillSectionProps, LayerFillSectionRef } from './types';
import useLayerFillSection from './useLayerFillSection';

const LayerFillSection = React.forwardRef<LayerFillSectionRef, LayerFillSectionProps>((props, ref) => {
  const viewModel = useLayerFillSection(props, ref);

  const { editable, fillColor, onFillColorChange } = viewModel;
  const { selected, className, ...restProps } = props;

  return (
    <Panel.Group as="div" {...restProps} ref={ref} className={clsx(styles.root, className)} heading="Fill">
      <LayerFieldset>
        <LayerField label="Color">
          <ColorPicker value={fillColor} onChange={onFillColorChange} disabled={!editable} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerFillSection.displayName = 'LayerFillSection';

export default LayerFillSection;
