import Box from '@pigyuma/design-system/primitives/Box';
import clsx from 'clsx';
import React from 'react';
import * as styles from './LayerField.css';
import { LayerFieldProps, LayerFieldRef } from './types';

const LayerField = React.forwardRef<LayerFieldRef, LayerFieldProps>((props, ref) => {
  const { label, ...restProps } = props;

  return (
    <Box {...restProps} ref={ref} as="div" className={clsx(styles.root, restProps.className)}>
      {label != null && <div className={styles.label}>{label}</div>}
      <div className={styles.content}>{restProps.children}</div>
    </Box>
  );
});
LayerField.displayName = 'LayerField';

export default LayerField;
