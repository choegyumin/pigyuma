import PrimitiveCheckboxGroup from '@/primitives/CheckboxGroup';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { Box } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './ToggleButtonGroup.css';
import { ToggleButtonGroupItemElementType, ToggleButtonGroupItemProps, ToggleButtonGroupItemRefInstance } from './types';

const ToggleButtonGroupItem = React.forwardRef<ToggleButtonGroupItemRefInstance, ToggleButtonGroupItemProps>((props, ref) => {
  const { className, children, ...rootProps } = omit(props, InputOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  return (
    <Box {...rootProps} ref={ref} as={ToggleButtonGroupItemElementType} className={clsx(styles.item, className)}>
      <PrimitiveCheckboxGroup.Item {...inputProps} />
      {children}
    </Box>
  );
});
ToggleButtonGroupItem.displayName = 'ToggleButtonGroupItem';

export default ToggleButtonGroupItem;
