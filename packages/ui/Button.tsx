import * as React from 'react';
import styles from './Button.css';

export const Button: React.FC<React.PropsWithChildren> = (props) => {
  return <button className={styles.root}>{props.children}</button>;
};
Button.displayName = 'Button';
