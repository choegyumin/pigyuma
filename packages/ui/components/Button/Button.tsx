import React from 'react';
import styles from './Button.css';
import { ButtonProps, ButtonRef } from './types';

const Button = React.forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  return (
    <button ref={ref} className={styles.root}>
      {props.children}
    </button>
  );
});
Button.displayName = 'Button';

export default Button;
