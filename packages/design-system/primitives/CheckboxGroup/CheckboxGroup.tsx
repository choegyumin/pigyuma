import { convertInputSelectedValue } from '@/utils/input';
import { useEvent, useValue } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import Box from '../Box';
import CheckboxGroupContextProvider from './CheckboxGroup.context';
import { CheckboxGroupProps, CheckboxGroupRef } from './types';

const CheckboxGroup = React.forwardRef<CheckboxGroupRef, CheckboxGroupProps>((props, ref) => {
  const { name, value, defaultValue, disabled, required, onChange, onChangeCapture, ...rootProps } = props;

  const [selected = [], setSelected] = useValue<Array<string | number>>(value, defaultValue);

  const getSelected = useCallback(
    (checkbox: HTMLInputElement) => {
      const currentValue = convertInputSelectedValue(checkbox);
      const newSelected = selected != null ? [...selected] : [];
      /** @todo value가 정의되지 않은 Checkbox가 있을 때의 동작 정의 */
      if (currentValue != null) {
        if (checkbox.checked) {
          newSelected.push(currentValue);
        } else {
          const targetIndex = newSelected.findIndex((it) => it === currentValue);
          if (targetIndex !== 1) {
            newSelected.splice(targetIndex, 1);
          }
        }
      }
      return newSelected;
    },
    [selected],
  );

  const onGroupChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = getSelected(event.currentTarget);
    onChange?.(event, newSelected);
    setSelected(newSelected);
  });

  const onGroupChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    const newSelected = getSelected(event.currentTarget);
    onChangeCapture?.(event, newSelected);
  });

  return (
    <CheckboxGroupContextProvider
      name={name}
      selected={selected}
      disabled={disabled}
      required={required}
      onChange={onGroupChange}
      onChangeCapture={onGroupChangeCapture}
    >
      <Box as="span" role="group" {...rootProps} ref={ref}>
        {rootProps.children}
      </Box>
    </CheckboxGroupContextProvider>
  );
});
CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
