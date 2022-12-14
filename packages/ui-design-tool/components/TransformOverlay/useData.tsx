import { UIRecordRect } from '@/types/Shape';
import { useRef } from 'react';
import { HandlePlacement } from '../TransformOverlay/types';
import { WorkspaceStatus } from '../Workspace/types';
import { useContextForInteraction } from '../Workspace/Workspace.context';

export type UseDataDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const { context } = deps;

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `hasSelectedOneOnly` 대신 `hasSelected` 로 교체 (Range Selection, Layer Grouping 기능과 함께 구현) */
  // const hasSelected = context.selectedRecords.size > 0;
  const hasSelectedOneOnly = context.selectedRecords.size === 1;

  const isActive =
    context.status === WorkspaceStatus.idle ||
    context.status === WorkspaceStatus.resizing ||
    (context.status === WorkspaceStatus.rotating && hasSelectedOneOnly);

  const [selectedRecordKey] = isActive ? context.selectedRecords.keys() : ([] as undefined[]);

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const resizeFromCenterRef = useRef<boolean>(false);
  const resizeHandlePlacementRef = useRef<HandlePlacement>();

  const rotateHandleCoordDegreesRef = useRef<number>();

  return {
    isActive,
    selectedRecordKey,
    transformInitialRectRef,
    transformLastRectRef,
    resizeFromCenterRef,
    resizeHandlePlacementRef,
    rotateHandleCoordDegreesRef,
  };
}

export type UseDataType = ReturnType<typeof useData>;
