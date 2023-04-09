import React from 'react';
import Box from '../Box';
import { SelectItemProps, SelectItemRef } from './types';

const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>((props, ref) => {
  const { value, ...rootProps } = props;

  return <Box {...rootProps} ref={ref} as="option" data-value={JSON.stringify(value)} data-value-type={typeof value} />;
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
