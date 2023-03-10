import { useEvent } from '@pigyuma/react-utils';
import React from 'react';
import Box from '../Box';
import { ColorPickerProps, ColorPickerRef } from './types';

/**
 * @todo ColorPicker 컴포넌트 고도화
 * - Modal, Popover, Dropdown, Palette 구현
 */
const ColorPicker = React.forwardRef<ColorPickerRef, ColorPickerProps>((props, ref) => {
  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event, event.currentTarget.value);
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    props.onChangeCapture?.(event, event.currentTarget.value);
  });

  return <Box {...props} ref={ref} as="input" type="color" onChange={onChange} onChangeCapture={onChangeCapture} />;
});
ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
