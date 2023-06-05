import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './LayerFieldset.css';
import { LayerFieldsetElementType, LayerFieldsetProps, LayerFieldsetRefInstance } from './types';

const LayerFieldset = React.forwardRef<LayerFieldsetRefInstance, LayerFieldsetProps>((props, ref) => {
  return <Box {...props} ref={ref} as={LayerFieldsetElementType} className={clsx(styles.root, props.className)} />;
});
LayerFieldset.displayName = 'LayerFieldset';

export default LayerFieldset;
