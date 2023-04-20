import React from 'react';
import Checkbox, { CheckboxProps } from '../Checkbox';
import { useCheckboxConfig, useCheckboxEvents, useSelectedValue } from './CheckboxGroup.context';
import { CheckboxGroupItemProps, CheckboxGroupItemRef } from './types';

const CheckboxGroupItem = React.forwardRef<CheckboxGroupItemRef, CheckboxGroupItemProps>((props, ref) => {
  const { value, ...rootProps } = props;

  const selectedValue = useSelectedValue();
  const { name, disabled, required } = useCheckboxConfig();
  const { onChange, onChangeCapture } = useCheckboxEvents();

  return (
    <Checkbox
      {...rootProps}
      ref={ref}
      name={name}
      disabled={disabled}
      required={required}
      checked={selectedValue.find((it) => it === value) != null}
      onChange={onChange as CheckboxProps['onChange']}
      onChangeCapture={onChangeCapture as CheckboxProps['onChangeCapture']}
    />
  );
});
CheckboxGroupItem.displayName = 'CheckboxGroupItem';

export default CheckboxGroupItem;
