import PrimitiveRadioGroup from '@/primitives/RadioGroup';
import clsx from 'clsx';
import React from 'react';
import * as styles from './RadioButtonGroup.css';
import { RadioButtonGroupProps, RadioButtonGroupRefInstance } from './types';

const RadioButtonGroup = React.forwardRef<RadioButtonGroupRefInstance, RadioButtonGroupProps>((props, ref) => {
  return <PrimitiveRadioGroup {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
RadioButtonGroup.displayName = 'RadioButtonGroup';

export default RadioButtonGroup;
