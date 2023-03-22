import Box from '@/primitives/Box';
import PrimitiveSelect from '@/primitives/Select';
import { SelectOnlyHTMLAttributeKeys, SelectOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { useEvent, useValue } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './Select.css';
import { SelectProps, SelectRef } from './types';

const Select = React.forwardRef<SelectRef, SelectProps>((props, ref) => {
  const rootProps = omit(props, SelectOnlyHTMLAttributeKeys) as Omit<typeof props, keyof SelectOnlyHTMLAttributes<HTMLSelectElement>>;

  const selectProps = pick(props, SelectOnlyHTMLAttributeKeys) as PickExisting<
    typeof props,
    keyof SelectOnlyHTMLAttributes<HTMLSelectElement>
  >;

  const [selected, setSelected] = useValue<string | number | undefined>(selectProps.value, selectProps.defaultValue, {
    notifyError: false,
  });

  const onChange = useEvent<NonNullable<typeof selectProps.onChange>>((event, newSelected) => {
    selectProps.onChange?.(event, newSelected);
    setSelected(newSelected);
  });

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, rootProps.className)}>
      <FieldTrigger className={styles.trigger} aria-hidden={true}>
        <button type="button">{selected}</button>
      </FieldTrigger>
      <PrimitiveSelect {...selectProps} className={styles.select} onChange={onChange}>
        {rootProps.children}
      </PrimitiveSelect>
    </Box>
  );
});
Select.displayName = 'Select';

export default Select;
