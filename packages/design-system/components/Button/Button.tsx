import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Button.css';
import { ButtonElementType, ButtonProps, ButtonRefInstance } from './types';

const Button = React.forwardRef<ButtonRefInstance, ButtonProps>((props, ref) => {
  return <Box as={ButtonElementType} {...props} ref={ref} className={clsx(styles.root, props.className)} />;
});
Button.displayName = 'Button';

export default Button;
