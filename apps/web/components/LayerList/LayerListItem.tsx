import Icon, { IconType } from '@pigyuma/design-system/components/Icon';
import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import LayerList from './LayerList';
import * as styles from './LayerList.css';
import { LayerListItemProps, LayerListItemRef } from './types';
import useLayerListItem from './useLayerListItem';

const IconTypeDict = {
  artboard: IconType.layout,
  container: IconType.square,
  stack: IconType.stack,
  columns: IconType.columns,
  rows: IconType.rows,
  grid: IconType.grid,
  text: IconType.text,
} as const;

/** @todo type, layerType에 따른 아이콘 추가 */
const LayerListItem = React.forwardRef<LayerListItemRef, LayerListItemProps>((props, ref) => {
  const viewModel = useLayerListItem(props, ref);
  if (viewModel == null) {
    return null;
  }

  const {
    restProps,
    forkedRef,
    listId,
    record,
    depth,
    role,
    selected,
    expanded,
    toggleable,
    layerType,
    onItemClick,
    onToggleClick,
    onGroupOpen,
  } = viewModel;

  const iconType = IconTypeDict[layerType];

  return (
    <Box {...restProps} ref={forkedRef} as="li" role="none" className={clsx(styles.row, { [styles.row_state.selected]: selected })}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className={styles.item} role={role} onClick={onItemClick}>
        <div className={styles.name}>
          <Icon type={iconType} className={styles.icon} />
          {record.name}
        </div>
        {toggleable && (
          <button
            className={clsx(styles.toggle, { [styles.toggle_state.expanded]: expanded })}
            aria-controls={listId}
            aria-expanded={expanded}
            aria-label="Open group"
            onClick={onToggleClick}
          />
        )}
      </div>
      {toggleable && (
        <LayerList
          role="group"
          records={record.children}
          depth={depth + 1}
          hidden={!expanded}
          onOpen={onGroupOpen}
          id={listId}
          aria-label={`${record.name}`}
        />
      )}
    </Box>
  );
});
LayerListItem.displayName = 'LayerListItem';

export default LayerListItem;
