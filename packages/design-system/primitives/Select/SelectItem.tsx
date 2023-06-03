import { Box } from '@pigyuma/react-utils';
import React from 'react';
import { SelectItemProps, SelectItemRefInstance } from './types';

const SelectItem = React.forwardRef<SelectItemRefInstance, SelectItemProps>((props, ref) => {
  const { value, ...rootProps } = props;

  return <Box {...rootProps} ref={ref} as="option" data-value={JSON.stringify(value)} data-value-type={typeof value} />;
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
