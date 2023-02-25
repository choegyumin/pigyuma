import { Box } from '@pigyuma/ui';
import { useUIData } from '@pigyuma/ui-design-tool';
import mixins from '@pigyuma/ui/styles/mixins';
import clsx from 'clsx';
import React from 'react';
import LayerList from './LayerList';
import * as styles from './LayerTreeSection.css';
import { LayerTreeSectionProps, LayerTreeSectionRef } from './types';

const LayerTreeSection = React.forwardRef<LayerTreeSectionRef, LayerTreeSectionProps>((props, ref) => {
  const uiData = useUIData();

  return (
    <Box as="div" {...props} ref={ref} className={clsx(styles.root, props.className)}>
      <h2 className={mixins.blind}>Layers</h2>
      <LayerList records={uiData.tree.children} />
    </Box>
  );
});
LayerTreeSection.displayName = 'LayerTreeSection';

export default LayerTreeSection;
