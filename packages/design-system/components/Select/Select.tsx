import Box from '@/primitives/Box';
import PrimitiveSelect from '@/primitives/Select';
import { SelectOnlyHTMLAttributeKeys, SelectOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { useEvent, useForceUpdate, useIsomorphicLayoutMount, useValue } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React, { useRef } from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './Select.css';
import { SelectProps, SelectRef } from './types';

const Select = React.forwardRef<SelectRef, SelectProps>((props, ref) => {
  const rootProps = omit(props, SelectOnlyHTMLAttributeKeys) as Omit<typeof props, keyof SelectOnlyHTMLAttributes<HTMLSelectElement>>;

  const selectProps = pick(props, SelectOnlyHTMLAttributeKeys) as PickExisting<
    typeof props,
    keyof SelectOnlyHTMLAttributes<HTMLSelectElement>
  >;

  const forceUpdate = useForceUpdate();

  const selectRef = useRef<HTMLSelectElement>(null);

  const [selected, setSelected] = useValue<string | number | undefined>(selectProps.value, selectProps.defaultValue, {
    notifyError: false,
  });

  const onChange = useEvent<NonNullable<typeof selectProps.onChange>>((event, newSelected) => {
    selectProps.onChange?.(event, newSelected);
    setSelected(newSelected);
  });

  const triggerInnerHTML = selectRef.current?.selectedOptions[0]?.innerHTML ?? String(selected ?? '');
  useIsomorphicLayoutMount(() => {
    // `triggerInnerHTML`는 `selectRef.current`가 있어야 얻을 수 있으므로 위해 재조정 유발
    // state 또는 context로 관리하는 것 대비 재조정 횟수가 적음 (최초 1회)
    forceUpdate();
  });

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, rootProps.className)}>
      <FieldTrigger className={styles.trigger} aria-hidden={true}>
        <button type="button" dangerouslySetInnerHTML={{ __html: triggerInnerHTML }} />
      </FieldTrigger>
      <PrimitiveSelect {...selectProps} className={styles.select} onChange={onChange} ref={selectRef}>
        {rootProps.children}
      </PrimitiveSelect>
    </Box>
  );
});
Select.displayName = 'Select';

export default Select;
