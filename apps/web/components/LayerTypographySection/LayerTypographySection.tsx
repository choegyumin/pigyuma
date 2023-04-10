import ColorPicker from '@pigyuma/design-system/components/ColorPicker';
import TextArea from '@pigyuma/design-system/components/TextArea';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerTypographySection.css';
import { LayerTypographySectionProps, LayerTypographySectionRef } from './types';
import useLayerTypographySection from './useLayerTypographySection';

const LayerTypographySection = React.forwardRef<LayerTypographySectionRef, LayerTypographySectionProps>((props, ref) => {
  const viewModel = useLayerTypographySection(props, ref);

  const { canEdit, textColor, content, onTextColorChange, onContentChange } = viewModel;
  const { selected, className, ...restProps } = props;

  return (
    <Panel.Group as="div" {...restProps} ref={ref} className={clsx(styles.root, className)} heading="Typography">
      <LayerFieldset>
        <LayerField label="Color">
          <ColorPicker value={textColor} onChange={onTextColorChange} disabled={!canEdit} />
        </LayerField>
        {/** @todo 캔버스에서 직접 편집 가능하게 되면: 삭제 */}
        <LayerField label="Content">
          <TextArea value={content} onChange={onContentChange} disabled={!canEdit} rows={4} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerTypographySection.displayName = 'LayerTypographySection';

export default LayerTypographySection;
