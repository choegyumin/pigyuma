import PrimitiveSelect from '@/primitives/Select';
import React from 'react';
import { SelectItemProps, SelectItemRef } from './types';

const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>((props, ref) => {
  return <PrimitiveSelect.Item {...props} ref={ref} />;
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
