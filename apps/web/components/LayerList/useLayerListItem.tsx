import { useEvent, useForkedRef, useWatch } from '@pigyuma/react-utils';
import { Artboard, TextLayer, useUIController, useUIData } from '@pigyuma/ui-design-tool';
import { ExcludeUIRecordWithChildren, ExtractUIRecordWithChildren, hasUIRecordChildren } from '@pigyuma/ui-design-tool/utils/model';
import { useEffect, useId, useState } from 'react';
import { LayerListItemProps, LayerListItemRefInstance } from './types';

export default function useLayerListItem(props: LayerListItemProps, ref: React.ForwardedRef<LayerListItemRefInstance>) {
  const componentId = useId();

  const forkedRef = useForkedRef(ref);

  const listId = `list-${componentId}`;

  const { record, depth = 0, onGroupOpen: onGroupOpenProp, role = 'treeitem', ...restProps } = props;

  const uiController = useUIController();
  const uiData = useUIData();

  const toggleable = hasUIRecordChildren(record);

  const draft = uiData.isDraft(record.key);
  const selected = uiData.isSelected(record.key);
  const [expanded, setExpanded] = useState<boolean>(false);

  const onItemClick = useEvent(() => {
    uiController.select([record.key]);
  });

  const onToggleClick = useEvent((event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded(toggleable ? !expanded : false);
  });

  const onGroupOpen = useEvent(() => {
    setExpanded(true);
    onGroupOpenProp?.();
  });

  useEffect(() => {
    if (!toggleable) {
      setExpanded(false);
    }
  }, [toggleable]);

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
    return;
  }

  const layerType = record instanceof Artboard ? 'artboard' : record instanceof TextLayer ? 'text' : record.shapeType;

  const recordResults = { record, toggleable } as
    | { record: ExtractUIRecordWithChildren<typeof record>; toggleable: true }
    | { record: ExcludeUIRecordWithChildren<typeof record>; toggleable: false };

  return {
    ...recordResults,
    restProps,
    forkedRef,
    listId,
    depth,
    role,
    selected,
    expanded,
    layerType,
    onItemClick,
    onToggleClick,
    onGroupOpen,
  };
}
