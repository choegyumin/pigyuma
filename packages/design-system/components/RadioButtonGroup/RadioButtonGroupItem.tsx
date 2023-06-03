import PrimitiveRadioGroup from '@/primitives/RadioGroup';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { Box } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './RadioButtonGroup.css';
import { RadioButtonGroupItemElementType, RadioButtonGroupItemProps, RadioButtonGroupItemRefInstance } from './types';

const RadioButtonGroupItem = React.forwardRef<RadioButtonGroupItemRefInstance, RadioButtonGroupItemProps>((props, ref) => {
  const { className, children, ...rootProps } = omit(props, InputOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  return (
    <Box as={RadioButtonGroupItemElementType} {...rootProps} ref={ref} className={clsx(styles.item, className)}>
      <PrimitiveRadioGroup.Item {...inputProps} />
      {children}
    </Box>
  );
});
RadioButtonGroupItem.displayName = 'RadioButtonGroupItem';

export default RadioButtonGroupItem;
