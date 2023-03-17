import { UIDesignToolStatus } from '@/api/UIDesignTool';
import useSelected from '@/hooks/useSelected';
import useStatus from '@/hooks/useStatus';
import { UIRecordRect } from '@/types/Geometry';
import { useRef } from 'react';
import { HandlePlacement } from '../TransformOverlay/types';

export default function useData() {
  const selectedKeys = useSelected();
  const status = useStatus();

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `hasSelected` 로 값 변경 (Range Selection, Layer Grouping 기능과 함께 구현) */
  const hasSelectedOneOnly = selectedKeys.size === 1;

  const isActive =
    status === UIDesignToolStatus.idle ||
    status === UIDesignToolStatus.resizing ||
    (status === UIDesignToolStatus.rotating && hasSelectedOneOnly);

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `selectedRecordKeys` 로 값 변경 (Range Selection, Layer Grouping 기능과 함께 구현) */
  const selectedRecordKey = isActive ? [...selectedKeys][0] : undefined;

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
