import { useEvent, useValue } from '@pigyuma/react-utils';
import React from 'react';
import Box from '../Box';
import RadioGroupContextProvider from './RadioGroup.context';
import { RadioGroupProps, RadioGroupRef } from './types';

const RadioGroup = React.forwardRef<RadioGroupRef, RadioGroupProps>((props, ref) => {
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
      <Box as="span" role="radiogroup" {...rootProps} ref={ref}>
        {rootProps.children}
      </Box>
    </RadioGroupContextProvider>
  );
});
RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
