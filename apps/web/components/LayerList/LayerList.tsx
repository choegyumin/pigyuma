import Box from '@pigyuma/design-system/primitives/Box';
import React from 'react';
import * as styles from './LayerList.css';
import LayerListItem from './LayerListItem';
import { LayerListProps, LayerListRef } from './types';

const LayerList = React.forwardRef<LayerListRef, LayerListProps>((props, ref) => {
  const { records, depth = 0, hidden = false, onOpen, role = 'tree', ...restProps } = props;

  return (
    <Box
      {...restProps}
      ref={ref}
      as="ul"
      role={role}
      className={styles.root}
      style={{ [styles.varNames.display]: `${hidden ? 'none' : 'block'}`, [styles.varNames.depth]: `${depth}` }}
    >
      {records.map((it) => (
        <LayerListItem key={it.key} record={it} depth={depth} onGroupOpen={onOpen} />
      ))}
    </Box>
  );
});
LayerList.displayName = 'LayerList';

export default LayerList;
