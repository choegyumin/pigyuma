import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './LayerField.css';
import { LayerFieldProps, LayerFieldRef } from './types';

const LayerField = React.forwardRef<LayerFieldRef, LayerFieldProps>((props, ref) => {
  const { label, className, children, ...restProps } = props;

  return (
    <Box {...restProps} ref={ref} as="div" className={clsx(styles.root, className)}>
      {label != null && <div className={styles.label}>{label}</div>}
      <div className={styles.content}>{children}</div>
    </Box>
  );
});
LayerField.displayName = 'LayerField';

export default LayerField;
