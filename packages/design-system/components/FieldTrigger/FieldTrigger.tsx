import Box from '@/primitives/Box';
import clsx from 'clsx';
import React from 'react';
import * as styles from './FieldTrigger.css';
import { FieldTriggerProps, FieldTriggerRef } from './types';

const FieldTrigger = React.forwardRef<FieldTriggerRef, FieldTriggerProps>((props, ref) => {
  return <Box as="span" {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
FieldTrigger.displayName = 'FieldTrigger';

export default FieldTrigger;
