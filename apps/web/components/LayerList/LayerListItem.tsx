import Icon, { IconType } from '@pigyuma/design-system/components/Icon';
import { Box, useEvent, useForkedRef, useWatch } from '@pigyuma/react-utils';
import { Artboard, TextLayer, useUIController, useUIData } from '@pigyuma/ui-design-tool';
import { hasUIRecordChildren } from '@pigyuma/ui-design-tool/utils/model';
import clsx from 'clsx';
import React, { useEffect, useId, useState } from 'react';
import LayerList from './LayerList';
import * as styles from './LayerList.css';
import { LayerListItemProps, LayerListItemRef } from './types';

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
  const componentId = useId();

  const forkedRef = useForkedRef(ref);

  const listId = `list-${componentId}`;

  const { record, depth = 0, onGroupOpen: onGroupOpenProp, role = 'treeitem', ...restProps } = props;

  const uiController = useUIController();
  const uiData = useUIData();

  const hasChildren = hasUIRecordChildren(record);

  const draft = uiData.isDraft(record.key);
  const selected = uiData.isSelected(record.key);
  const [expanded, setExpanded] = useState<boolean>(false);

  const onItemClick = useEvent(() => {
    uiController.select([record.key]);
  });

  const onToggleClick = useEvent((event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded(hasChildren ? !expanded : false);
  });

  const onGroupOpen = useEvent(() => {
    setExpanded(true);
    onGroupOpenProp?.();
  });

  useEffect(() => {
    if (!hasChildren) {
      setExpanded(false);
    }
  }, [hasChildren]);

  useWatch(() => {
    if (!draft && selected) {
      onGroupOpenProp?.();
      // 상위 Group들이 열리기를 기다림
      window.requestAnimationFrame(() => {
        forkedRef.current?.scrollIntoView();
      });
    }
  }, [draft, selected]);

  if (draft) {
    return null;
  }

  const iconTypeKey = Artboard.isModel(record) ? 'artboard' : TextLayer.isModel(record) ? 'text' : record.shapeType;
  const iconType = IconTypeDict[iconTypeKey];

  return (
    <Box {...restProps} ref={forkedRef} as="li" role="none" className={clsx(styles.row, { [styles.row_state.selected]: selected })}>
      <div className={styles.item} role={role} onClick={onItemClick}>
        <div className={styles.name}>
          <Icon type={iconType} className={styles.icon} />
          {record.name}
        </div>
        {hasChildren && (
          <button
            className={clsx(styles.toggle, { [styles.toggle_state.expanded]: expanded })}
            aria-controls={listId}
            aria-expanded={expanded}
            aria-label="Open group"
            onClick={onToggleClick}
          />
        )}
      </div>
      {hasChildren && (
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
