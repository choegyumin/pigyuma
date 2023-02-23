import React from 'react';
import LayerListItem from './LayerListItem';
import * as styles from './LayerTreeSection.css';
import { LayerListProps, LayerListRef } from './types';

const LayerList = React.forwardRef<LayerListRef, LayerListProps>((props, ref) => {
  const { records, depth = 0, hidden = false, onOpen, role = 'tree', ...restProps } = props;

  return (
    <ul
      {...restProps}
      ref={ref}
      role={role}
      className={styles.group}
      style={{ [styles.varNames.display]: `${hidden ? 'none' : 'block'}`, [styles.varNames.depth]: `${depth}` }}
    >
      {records.map((it) => (
        <LayerListItem key={it.key} record={it} depth={depth} onGroupOpen={onOpen} />
      ))}
    </ul>
  );
});
LayerList.displayName = 'LayerList';

export default LayerList;
