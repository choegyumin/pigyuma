import { useEvent, Box } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import { RadioElementType, RadioProps, RadioRefInstance } from './types';

const Radio = React.forwardRef<RadioRefInstance, RadioProps>((props, ref) => {
  const { cancelable, value, onChange, onChangeCapture, ...rootProps } = props;

  const type = cancelable ? 'checkbox' : 'radio';

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
      as={RadioElementType}
      type={type}
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
