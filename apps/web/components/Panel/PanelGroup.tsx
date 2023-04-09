import Box from '@pigyuma/design-system/primitives/Box';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Panel.css';
import { PanelGroupProps, PanelGroupComponentFunction } from './types';

const PanelGroup = React.forwardRef<HTMLElement, PanelGroupProps>((props, ref) => {
  const { level = 2, heading, className, children, ...restProps } = props;

  return (
    <Box {...restProps} ref={ref} className={clsx(styles.group, className)}>
      {heading && (
        <Box as={`h${level}`} className={styles.heading}>
          {heading}
        </Box>
      )}
      <div className={styles.content}>{children}</div>
    </Box>
  );
}) as PanelGroupComponentFunction;
PanelGroup.displayName = 'PanelGroup';

export default PanelGroup;
