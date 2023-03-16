import React from 'react';
import Radio, { RadioProps } from '../Radio';
import { useRadioConfig, useRadioEvents, useSelectedValue } from './RadioGroup.context';
import { RadioGroupItemProps, RadioGroupItemRef } from './types';

const RadioGroupItem = React.forwardRef<RadioGroupItemRef, RadioGroupItemProps>((props, ref) => {
  const { value } = props;

  const currentValue = useSelectedValue();
  const { name, cancelable, disabled, required } = useRadioConfig();
  const { onChange, onChangeCapture } = useRadioEvents();

  return (
    <Radio
      {...props}
      ref={ref}
      name={name}
      cancelable={cancelable}
      disabled={disabled}
      required={required}
      checked={value === currentValue}
      onChange={onChange as RadioProps['onChange']}
      onChangeCapture={onChangeCapture as RadioProps['onChangeCapture']}
    >
      {props.children}
    </Radio>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export default RadioGroupItem;
