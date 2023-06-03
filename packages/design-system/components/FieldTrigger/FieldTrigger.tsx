import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './FieldTrigger.css';
import { FieldTriggerElementType, FieldTriggerProps, FieldTriggerRefInstance } from './types';

const FieldTrigger = React.forwardRef<FieldTriggerRefInstance, FieldTriggerProps>((props, ref) => {
  return <Box as={FieldTriggerElementType} {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
FieldTrigger.displayName = 'FieldTrigger';

export default FieldTrigger;
