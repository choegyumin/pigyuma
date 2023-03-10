import { useEvent } from '@pigyuma/react-utils';
import React from 'react';
import Box from '../Box';
import { TextInputProps, TextInputRef } from './types';

const TextInput = React.forwardRef<TextInputRef, TextInputProps>((props, ref) => {
  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event, event.currentTarget.value);
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    props.onChangeCapture?.(event, event.currentTarget.value);
  });

  const onFocusCapture = useEvent((event: React.FocusEvent<HTMLInputElement>) => {
    props.onFocusCapture?.(event);
    if (props.autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  return (
    <Box
      {...props}
      ref={ref}
      as="input"
      type={props.type ?? 'text'}
      onChange={onChange}
      onChangeCapture={onChangeCapture}
      onFocusCapture={onFocusCapture}
    />
  );
});
TextInput.displayName = 'TextInput';

export default TextInput;
