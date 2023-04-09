import PCheckboxGroup from '@/primitives/CheckboxGroup';
import clsx from 'clsx';
import React from 'react';
import * as styles from './ToggleButtonGroup.css';
import { ToggleButtonGroupProps, ToggleButtonGroupRef } from './types';

const ToggleButtonGroup = React.forwardRef<ToggleButtonGroupRef, ToggleButtonGroupProps>((props, ref) => {
  return <PCheckboxGroup {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

export default ToggleButtonGroup;
