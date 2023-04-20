import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Button.css';
import { ButtonProps, ButtonRef } from './types';

const Button = React.forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  return <Box as="button" {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
Button.displayName = 'Button';

export default Button;
