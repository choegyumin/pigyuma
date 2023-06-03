import PrimitiveSelect from '@/primitives/Select';
import React from 'react';
import { SelectItemProps, SelectItemRefInstance } from './types';

const SelectItem = React.forwardRef<SelectItemRefInstance, SelectItemProps>((props, ref) => {
  return <PrimitiveSelect.Item {...props} ref={ref} />;
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
