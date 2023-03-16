import React from 'react';
import Box from '../Box';
import { SelectItemProps, SelectItemRef } from './types';

const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>((props, ref) => {
  return (
    <Box {...props} ref={ref} as="option" data-value={JSON.stringify(props.value)} data-value-type={typeof props.value}>
      {props.children}
    </Box>
  );
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
