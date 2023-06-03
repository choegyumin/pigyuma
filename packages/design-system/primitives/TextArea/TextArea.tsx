import { useEvent, Box } from '@pigyuma/react-utils';
import React from 'react';
import { TextAreaElementType, TextAreaProps, TextAreaRefInstance } from './types';

const TextArea = React.forwardRef<TextAreaRefInstance, TextAreaProps>((props, ref) => {
  const { autoSelect, onChange, onChangeCapture, onFocusCapture, ...rootProps } = props;

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event, event.currentTarget.value);
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLTextAreaElement>) => {
    onChangeCapture?.(event, event.currentTarget.value);
  });

  const onFieldFocusCapture = useEvent((event: React.FocusEvent<HTMLTextAreaElement>) => {
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
      as={TextAreaElementType}
      onChange={onFieldChange}
      onChangeCapture={onFieldChangeCapture}
      onFocusCapture={onFieldFocusCapture}
    />
  );
});
TextArea.displayName = 'TextArea';

export default TextArea;
