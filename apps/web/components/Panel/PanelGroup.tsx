import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Panel.css';
import { PanelGroupProps, PanelGroupComponent, PanelGroupRefInstance, DefaultPanelGroupElementType } from './types';

const PanelGroup = React.forwardRef<PanelGroupRefInstance, PanelGroupProps>((props, ref) => {
  const { as = DefaultPanelGroupElementType, level = 2, heading, className, children, ...restProps } = props;

  return (
    <Box {...restProps} ref={ref} as={as} className={clsx(styles.group, className)}>
      {heading && (
        <Box as={`h${level}`} className={styles.heading}>
          {heading}
        </Box>
      )}
      <div className={styles.content}>{children}</div>
    </Box>
  );
}) as PanelGroupComponent;
PanelGroup.displayName = 'PanelGroup';

export default PanelGroup;
