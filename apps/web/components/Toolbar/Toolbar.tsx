import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Toolbar.css';
import { ToolbarComponentFunction, ToolbarProps } from './types';

const Toolbar = React.forwardRef<HTMLElement, ToolbarProps>((props, ref) => {
  const { as = 'div', role = 'toolbar', className, ...restProps } = props;

  return <Box {...restProps} ref={ref} as={as} role={role} className={clsx(styles.root, className)} />;
}) as ToolbarComponentFunction;
Toolbar.displayName = 'Toolbar';

export default Toolbar;
