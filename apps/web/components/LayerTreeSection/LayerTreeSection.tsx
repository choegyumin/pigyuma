import mixins from '@pigyuma/design-system/mixins';
import { Box } from '@pigyuma/react-utils';
import { useUIData } from '@pigyuma/ui-design-tool';
import clsx from 'clsx';
import React from 'react';
import LayerList from '../LayerList';
import * as styles from './LayerTreeSection.css';
import { LayerTreeSectionElementType, LayerTreeSectionProps, LayerTreeSectionRefInstance } from './types';

const LayerTreeSection = React.forwardRef<LayerTreeSectionRefInstance, LayerTreeSectionProps>((props, ref) => {
  const uiData = useUIData();

  return (
    <Box {...props} ref={ref} as={LayerTreeSectionElementType} className={clsx(styles.root, props.className)}>
      <h2 className={mixins.blind}>Layers</h2>
      <LayerList records={uiData.tree.children} />
    </Box>
  );
});
LayerTreeSection.displayName = 'LayerTreeSection';

export default LayerTreeSection;
