import { useEvent } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import Box from '../Box';
import { RadioProps, RadioRef } from './types';

const Radio = React.forwardRef<RadioRef, RadioProps>((props, ref) => {
  const { cancelable, ...rootProps } = props;

  const isCheckbox = cancelable;

  const getSelected = useCallback(
    (radio: HTMLInputElement): string | number | undefined => {
      return radio.checked ? props.value : undefined;
    },
    [props.value],
  );

  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event, getSelected(event.currentTarget));
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    props.onChangeCapture?.(event, getSelected(event.currentTarget));
  });

  return (
    <Box
      role="radio"
      {...rootProps}
      ref={ref}
      as="input"
      type={isCheckbox ? 'checkbox' : 'radio'}
      data-value={JSON.stringify(props.value)}
      data-value-type={typeof props.value}
      onChange={onChange}
      onChangeCapture={onChangeCapture}
    />
  );
});
Radio.displayName = 'Radio';

export default Radio;
