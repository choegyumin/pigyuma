import PrimitiveSelect from '@/primitives/Select';
import clsx from 'clsx';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './Select.css';
import SelectRoot from './SelectRoot';
import { SelectProps, SelectRef } from './types';

const Select = React.forwardRef<SelectRef, SelectProps>((props, ref) => {
  return (
    <FieldTrigger>
      <PrimitiveSelect {...props} ref={ref} className={clsx(styles.root, props.className)} slots={{ root: SelectRoot }}>
        {props.children}
      </PrimitiveSelect>
    </FieldTrigger>
  );
});
Select.displayName = 'Select';

export default Select;
