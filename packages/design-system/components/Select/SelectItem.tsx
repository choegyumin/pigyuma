import PrimitiveSelect from '@/primitives/Select';
import React from 'react';
import { SelectItemProps, SelectItemRef } from './types';

const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>((props, ref) => {
  return (
    <PrimitiveSelect.Item {...props} ref={ref}>
      {props.children}
    </PrimitiveSelect.Item>
  );
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
