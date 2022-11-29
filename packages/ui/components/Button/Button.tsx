import React from 'react';
import Box from '@pigyuma/ui/patterns/Box';
import styles from './Button.css';
import { ButtonProps, ButtonRef } from './types';

const Button = React.forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  return (
    <Box as="button" {...props} ref={ref} className={`${styles.root} ${props.className || ''}`}>
      {props.children}
    </Box>
  );
});
Button.displayName = 'Button';

export default Button;
