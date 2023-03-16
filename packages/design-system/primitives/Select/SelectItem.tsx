import OptionUnstyled from '@mui/base/OptionUnstyled';
import React from 'react';
import Box from '../Box';
import { SelectItemProps, SelectItemRef } from './types';

const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>((props, ref) => {
  return (
    <Box {...props} ref={ref} as={OptionUnstyled}>
      {props.children}
    </Box>
  );
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
