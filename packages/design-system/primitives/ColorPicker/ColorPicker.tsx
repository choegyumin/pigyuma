import { useEvent, Box } from '@pigyuma/react-utils';
import React from 'react';
import { ColorPickerProps, ColorPickerRef } from './types';

/**
 * @todo ColorPicker 컴포넌트 고도화
 * - Modal, Popover, Dropdown, Palette 구현
 * - 투명도 옵션 추가
 */
const ColorPicker = React.forwardRef<ColorPickerRef, ColorPickerProps>((props, ref) => {
  const { onChange, onChangeCapture, ...rootProps } = props;

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event, event.currentTarget.value);
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    onChangeCapture?.(event, event.currentTarget.value);
  });

  return <Box {...rootProps} ref={ref} as="input" type="color" onChange={onFieldChange} onChangeCapture={onFieldChangeCapture} />;
});
ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
