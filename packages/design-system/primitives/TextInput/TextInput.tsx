import { useEvent, Box } from '@pigyuma/react-utils';
import React from 'react';
import { TextInputElementType, TextInputProps, TextInputRefInstance } from './types';

const TextInput = React.forwardRef<TextInputRefInstance, TextInputProps>((props, ref) => {
  const { type = 'text', autoSelect, onChange, onChangeCapture, onFocusCapture, ...rootProps } = props;

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event, event.currentTarget.value);
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    onChangeCapture?.(event, event.currentTarget.value);
  });

  const onFieldFocusCapture = useEvent((event: React.FocusEvent<HTMLInputElement>) => {
    onFocusCapture?.(event);
    if (autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  return (
    <Box
      {...rootProps}
      ref={ref}
      as={TextInputElementType}
      type={type}
      onChange={onFieldChange}
      onChangeCapture={onFieldChangeCapture}
      onFocusCapture={onFieldFocusCapture}
    />
  );
});
TextInput.displayName = 'TextInput';

export default TextInput;
