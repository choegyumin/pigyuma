import React from 'react';
import Checkbox, { CheckboxProps } from '../Checkbox';
import { useCheckboxConfig, useCheckboxEvents, useSelectedValue } from './CheckboxGroup.context';
import { CheckboxGroupItemProps, CheckboxGroupItemRef } from './types';

const CheckboxGroupItem = React.forwardRef<CheckboxGroupItemRef, CheckboxGroupItemProps>((props, ref) => {
  const { value } = props;

  const selectedValue = useSelectedValue();
  const { name, disabled, required } = useCheckboxConfig();
  const { onChange, onChangeCapture } = useCheckboxEvents();

  return (
    <Checkbox
      {...props}
      ref={ref}
      name={name}
      disabled={disabled}
      required={required}
      checked={selectedValue.find((it) => it === value) != null}
      onChange={onChange as CheckboxProps['onChange']}
      onChangeCapture={onChangeCapture as CheckboxProps['onChangeCapture']}
    >
      {props.children}
    </Checkbox>
  );
});
CheckboxGroupItem.displayName = 'CheckboxGroupItem';

export default CheckboxGroupItem;
