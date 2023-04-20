import PRadioGroup from '@/primitives/RadioGroup';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { Box, ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './RadioButtonGroup.css';
import { RadioButtonGroupItemProps, RadioButtonGroupItemRef } from './types';

const RadioButtonGroupItem = React.forwardRef<RadioButtonGroupItemRef, RadioButtonGroupItemProps>((props, ref) => {
  const { className, children, ...rootProps } = omit(props, InputOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  return (
    <Box as="label" {...(rootProps as ComponentPropsWithoutRefByBox<'label'>)} ref={ref} className={clsx(styles.item, className)}>
      <PRadioGroup.Item {...inputProps} />
      {children}
    </Box>
  );
});
RadioButtonGroupItem.displayName = 'RadioButtonGroupItem';

export default RadioButtonGroupItem;
