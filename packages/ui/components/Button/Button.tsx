import Box from '@/patterns/Box';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Button.css';
import { ButtonProps, ButtonRef } from './types';

const Button = React.forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  return (
    <Box as="button" {...props} ref={ref} className={clsx(styles.root, props.className)}>
      {props.children}
    </Box>
  );
});
Button.displayName = 'Button';

export default Button;
