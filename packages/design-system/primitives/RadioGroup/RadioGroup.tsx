import { useEvent, useValue, Box } from '@pigyuma/react-utils';
import React from 'react';
import RadioGroupContextProvider from './RadioGroup.context';
import { RadioGroupElementType, RadioGroupProps, RadioGroupRefInstance } from './types';

const RadioGroup = React.forwardRef<RadioGroupRefInstance, RadioGroupProps>((props, ref) => {
  const { name, value, defaultValue, disabled, required, cancelable, onChange, onChangeCapture, ...rootProps } = props;

  const [selected, setSelected] = useValue<string | number | undefined>(value, defaultValue);

  const onGroupChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, newSelected: string | number | undefined) => {
    onChange?.(event, newSelected);
    setSelected(newSelected);
  });

  const onGroupChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>, newSelected: string | number | undefined) => {
    onChangeCapture?.(event, newSelected);
  });

  return (
    <RadioGroupContextProvider
      name={name}
      selected={selected}
      disabled={disabled}
      required={required}
      cancelable={cancelable}
      onChange={onGroupChange}
      onChangeCapture={onGroupChangeCapture}
    >
      <Box role="radiogroup" {...rootProps} ref={ref} as={RadioGroupElementType} />
    </RadioGroupContextProvider>
  );
});
RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
