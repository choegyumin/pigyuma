import Box from '@pigyuma/design-system/primitives/Box';
import clsx from 'clsx';
import React from 'react';
import * as styles from './LayerFieldset.css';
import { LayerFieldsetProps, LayerFieldsetRef } from './types';

const LayerFieldset = React.forwardRef<LayerFieldsetRef, LayerFieldsetProps>((props, ref) => {
  return <Box {...props} ref={ref} as="fieldset" className={clsx(styles.root, props.className)} />;
});
LayerFieldset.displayName = 'LayerFieldset';

export default LayerFieldset;
