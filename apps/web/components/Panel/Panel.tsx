import { Box } from '@pigyuma/ui/patterns';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Panel.css';
import { PanelComponentFunction, PanelProps } from './types';

const Panel = React.forwardRef<HTMLElement, PanelProps>((props, ref) => {
  const { as = 'aside', role = 'complementary', placement, ...restProps } = props;

  return (
    <Box {...restProps} ref={ref} as={as} role={role} className={clsx(styles.root, styles.root$[placement], props.className)}>
      {props.children}
    </Box>
  );
}) as PanelComponentFunction;
Panel.displayName = 'Panel';

export default Panel;
