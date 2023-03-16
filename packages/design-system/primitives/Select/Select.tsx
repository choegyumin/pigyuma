import SelectUnstyled from '@mui/base/SelectUnstyled';
import React, { useMemo } from 'react';
import Box from '../Box';
import { SelectProps, SelectRef, SelectValue } from './types';

const Select = React.forwardRef<SelectRef, SelectProps>((props, ref) => {
  const slotProps = useMemo(
    () => ({
      ...props.slotProps,
      popper: {
        disablePortal: false,
        ...props.slotProps?.popper,
      },
    }),
    [props.slotProps],
  );

  return (
    <Box {...props} ref={ref} as={SelectUnstyled as typeof SelectUnstyled<SelectValue>} slotProps={slotProps}>
      {props.children}
    </Box>
  );
});
Select.displayName = 'Select';

export default Select;
