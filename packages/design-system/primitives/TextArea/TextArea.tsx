import { useEvent } from '@pigyuma/react-utils';
import React from 'react';
import Box from '../Box';
import { TextAreaProps, TextAreaRef } from './types';

const TextArea = React.forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  const onChange = useEvent((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(event, event.currentTarget.value);
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLTextAreaElement>) => {
    props.onChangeCapture?.(event, event.currentTarget.value);
  });

  const onFocusCapture = useEvent((event: React.FocusEvent<HTMLTextAreaElement>) => {
    props.onFocusCapture?.(event);
    if (props.autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  return <Box {...props} ref={ref} as="textarea" onChange={onChange} onChangeCapture={onChangeCapture} onFocusCapture={onFocusCapture} />;
});
TextArea.displayName = 'TextArea';

export default TextArea;
