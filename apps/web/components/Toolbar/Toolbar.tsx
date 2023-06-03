import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Toolbar.css';
import { DefaultToolbarElementType, ToolbarComponent, ToolbarProps, ToolbarRefInstance } from './types';

const Toolbar = React.forwardRef<ToolbarRefInstance, ToolbarProps>((props, ref) => {
  const { as = DefaultToolbarElementType, role = 'toolbar', className, ...restProps } = props;

  return <Box {...restProps} ref={ref} as={as} role={role} className={clsx(styles.root, className)} />;
}) as ToolbarComponent;
Toolbar.displayName = 'Toolbar';

export default Toolbar;
