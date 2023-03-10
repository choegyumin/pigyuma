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
  const getSelected = useCallback((select: HTMLSelectElement): string | number | undefined => {
    const { selectedIndex } = select;
    const option = select.querySelectorAll('option')[selectedIndex] as HTMLOptionElement | undefined;
    return option == null ? undefined : convertInputSelectedValue(option);
  }, []);

  const onChange = useEvent((event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange?.(event, getSelected(event.currentTarget));
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLSelectElement>) => {
    props.onChangeCapture?.(event, getSelected(event.currentTarget));
  });

  return (
    <Box {...props} ref={ref} as="select" onChange={onChange} onChangeCapture={onChangeCapture}>
      {props.children}
    </Box>
  );
});
Select.displayName = 'Select';

export default Select;
