import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useUIDesignToolStatus, useUIDesignToolAPI } from '@/hooks';
import useSelectedUIRecords from '@/hooks/useSelectedUIRecords';
import { UIRecordRect } from '@/types/Geometry';
import { useRef } from 'react';
import { HandlePlacement } from '../TransformOverlay/types';

export type UseDataDependencys = {
  api: ReturnType<typeof useUIDesignToolAPI>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const selectedRecords = useSelectedUIRecords();
  const status = useUIDesignToolStatus();

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `hasSelected` 로 값 변경 (Range Selection, Layer Grouping 기능과 함께 구현) */
  const hasSelectedOneOnly = selectedRecords.size === 1;

  const isActive =
    status === UIDesignToolStatus.idle ||
    status === UIDesignToolStatus.resizing ||
    (status === UIDesignToolStatus.rotating && hasSelectedOneOnly);

  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `selectedRecordKeys` 로 값 변경 (Range Selection, Layer Grouping 기능과 함께 구현) */
  const selectedRecordKey = isActive ? [...selectedRecords][0]?.key : undefined;

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
