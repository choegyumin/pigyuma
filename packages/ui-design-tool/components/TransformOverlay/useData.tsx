import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { UIRecordRect } from '@/types/Geometry';
import { useRef } from 'react';
import { HandlePlacement } from '../TransformOverlay/types';
import { useContextForInteraction } from '../Workspace/Workspace.context';

export type UseDataDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const { context } = deps;

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `hasSelected` 로 값 변경 (Range Selection, Layer Grouping 기능과 함께 구현) */
  const hasSelectedOneOnly = context.selectedRecords.size === 1;

  const isActive =
    context.status === UIDesignToolStatus.idle ||
    context.status === UIDesignToolStatus.resizing ||
    (context.status === UIDesignToolStatus.rotating && hasSelectedOneOnly);

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `selectedRecordKeys` 로 값 변경 (Range Selection, Layer Grouping 기능과 함께 구현) */
  const [selectedRecordKey] = isActive ? context.selectedRecords.keys() : ([] as undefined[]);

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const resizeHandlePlacementRef = useRef<HandlePlacement>();

  const rotateHandleCoordDegreesRef = useRef<number>();

  return {
    isActive,
    selectedRecordKey,
    transformInitialRectRef,
    transformLastRectRef,
    resizeHandlePlacementRef,
    rotateHandleCoordDegreesRef,
  };
}

export type UseDataType = ReturnType<typeof useData>;
