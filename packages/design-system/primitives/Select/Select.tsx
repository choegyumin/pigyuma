import { convertInputSelectedValue } from '@/utils/input';
import { useEvent } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import Box from '../Box';
import { SelectProps, SelectRef } from './types';

/**
 * @todo Select 컴포넌트 고도화
 * - Modal, Popover, Dropdown, Menu 구현
 * - select를 input, option을 button으로 대체
 */
const Select = React.forwardRef<SelectRef, SelectProps>((props, ref) => {
  const { onChange, onChangeCapture, ...rootProps } = props;

  const getSelected = useCallback((select: HTMLSelectElement): string | number | undefined => {
    const { selectedIndex } = select;
    const option = select.querySelectorAll('option')[selectedIndex] as HTMLOptionElement | undefined;
    return option == null ? undefined : convertInputSelectedValue(option);
  }, []);

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event, getSelected(event.currentTarget));
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLSelectElement>) => {
    onChangeCapture?.(event, getSelected(event.currentTarget));
  });

  return <Box {...rootProps} ref={ref} as="select" onChange={onFieldChange} onChangeCapture={onFieldChangeCapture} />;
});
Select.displayName = 'Select';

export default Select;
