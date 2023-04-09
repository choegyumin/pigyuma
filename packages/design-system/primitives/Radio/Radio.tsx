import { useEvent } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import Box from '../Box';
import { RadioProps, RadioRef } from './types';

const Radio = React.forwardRef<RadioRef, RadioProps>((props, ref) => {
  const { cancelable, value, onChange, onChangeCapture, ...rootProps } = props;

  const isCheckbox = cancelable;

  const getSelected = useCallback(
    (radio: HTMLInputElement): string | number | undefined => {
      return radio.checked ? value : undefined;
    },
    [value],
  );

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event, getSelected(event.currentTarget));
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    onChangeCapture?.(event, getSelected(event.currentTarget));
  });

  return (
    <Box
      role="radio"
      {...rootProps}
      ref={ref}
      as="input"
      type={isCheckbox ? 'checkbox' : 'radio'}
      value={value}
      data-value={JSON.stringify(value)}
      data-value-type={typeof value}
      onChange={onFieldChange}
      onChangeCapture={onFieldChangeCapture}
    />
  );
});
Radio.displayName = 'Radio';

export default Radio;
