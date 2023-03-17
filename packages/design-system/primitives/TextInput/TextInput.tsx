import { useEvent } from '@pigyuma/react-utils';
import React from 'react';
import Box from '../Box';
import { TextInputProps, TextInputRef } from './types';

const TextInput = React.forwardRef<TextInputRef, TextInputProps>((props, ref) => {
  const { autoSelect, ...restProps } = props;

  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    restProps.onChange?.(event, event.currentTarget.value);
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    restProps.onChangeCapture?.(event, event.currentTarget.value);
  });

  const onFocusCapture = useEvent((event: React.FocusEvent<HTMLInputElement>) => {
    restProps.onFocusCapture?.(event);
    if (autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  return (
    <Box
      {...restProps}
      ref={ref}
      as="input"
      type={restProps.type ?? 'text'}
      onChange={onChange}
      onChangeCapture={onChangeCapture}
      onFocusCapture={onFocusCapture}
    />
  );
});
TextInput.displayName = 'TextInput';

export default TextInput;
