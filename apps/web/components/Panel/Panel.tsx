import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Panel.css';
import { DefaultPanelElementType, PanelComponent, PanelProps, PanelRefInstance } from './types';

const Panel = React.forwardRef<PanelRefInstance, PanelProps>((props, ref) => {
  const { as = DefaultPanelElementType, role = 'complementary', placement, className, ...restProps } = props;

  return <Box {...restProps} ref={ref} as={as} role={role} className={clsx(styles.root, styles.root_placement[placement], className)} />;
}) as PanelComponent;
Panel.displayName = 'Panel';

export default Panel;
