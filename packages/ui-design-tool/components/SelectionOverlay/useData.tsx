import { UIDesignToolStatus } from '@/api/UIDesignTool';
import useStatus from '@/hooks/useStatus';
import { UIRecordKey } from '@/types/Identifier';
import { useRef, useState } from 'react';

export default function useData() {
  const status = useStatus();

  const isActive = status === UIDesignToolStatus.idle || status === UIDesignToolStatus.selecting;

  const [hoveredRecordKey, setHoveredRecordKey] = useState<UIRecordKey | undefined>();
  const clickedTargetRef = useRef<EventTarget | null>(null);

  return {
    isActive,
    hoveredRecordKey,
    setHoveredRecordKey,
    clickedTargetRef,
  };
}

export type UseDataType = ReturnType<typeof useData>;
