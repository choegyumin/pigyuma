import { SelectRootProps, SelectRootRef } from '@/primitives/Select';
import React from 'react';

const SelectItem = React.forwardRef<SelectRootRef, SelectRootProps>((props, ref) => {
  const { ownerState, ...restProps } = props;
  return (
    <button {...restProps} ref={ref} type="button">
      {restProps.children}
    </button>
  );
});
SelectItem.displayName = 'SelectItem';

export default SelectItem;
