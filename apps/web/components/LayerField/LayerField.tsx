import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './LayerField.css';
import { LayerFieldElementType, LayerFieldProps, LayerFieldRefInstance } from './types';

const LayerField = React.forwardRef<LayerFieldRefInstance, LayerFieldProps>((props, ref) => {
  const { label, className, children, ...restProps } = props;

  return (
    <Box {...restProps} ref={ref} as={LayerFieldElementType} className={clsx(styles.root, className)}>
      {label != null && <div className={styles.label}>{label}</div>}
      <div className={styles.content}>{children}</div>
    </Box>
  );
});
LayerField.displayName = 'LayerField';

export default LayerField;
