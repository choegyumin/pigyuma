import PRadioGroup from '@/primitives/RadioGroup';
import clsx from 'clsx';
import React from 'react';
import * as styles from './RadioButtonGroup.css';
import { RadioButtonGroupProps, RadioButtonGroupRef } from './types';

const RadioButtonGroup = React.forwardRef<RadioButtonGroupRef, RadioButtonGroupProps>((props, ref) => {
  return <PRadioGroup {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
RadioButtonGroup.displayName = 'RadioButtonGroup';

export default RadioButtonGroup;
