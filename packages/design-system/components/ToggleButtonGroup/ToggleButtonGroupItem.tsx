import Box, { ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import PCheckboxGroup from '@/primitives/CheckboxGroup';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './ToggleButtonGroup.css';
import { ToggleButtonGroupItemProps, ToggleButtonGroupItemRef } from './types';

const ToggleButtonGroupItem = React.forwardRef<ToggleButtonGroupItemRef, ToggleButtonGroupItemProps>((props, ref) => {
  const rootProps = omit(props, InputOnlyHTMLAttributeKeys) as Omit<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  return (
    <Box as="label" {...(rootProps as ComponentPropsWithoutRefByBox<'label'>)} ref={ref}>
      <PCheckboxGroup.Item {...inputProps} className={clsx(styles.item, rootProps.className)} />
      {rootProps.children}
    </Box>
  );
});
ToggleButtonGroupItem.displayName = 'ToggleButtonGroupItem';

export default ToggleButtonGroupItem;
