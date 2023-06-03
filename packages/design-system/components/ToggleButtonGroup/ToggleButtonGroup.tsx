import PrimitiveCheckboxGroup from '@/primitives/CheckboxGroup';
import clsx from 'clsx';
import React from 'react';
import * as styles from './ToggleButtonGroup.css';
import { ToggleButtonGroupProps, ToggleButtonGroupRefInstance } from './types';

const ToggleButtonGroup = React.forwardRef<ToggleButtonGroupRefInstance, ToggleButtonGroupProps>((props, ref) => {
  return <PrimitiveCheckboxGroup {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

export default ToggleButtonGroup;
