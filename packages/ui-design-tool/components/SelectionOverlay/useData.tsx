import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useUIDesignToolStatus, useUIDesignToolAPI } from '@/hooks';
import { UIRecordKey } from '@/types/Identifier';
import { useRef, useState } from 'react';

export type UseDataDependencys = {
  api: ReturnType<typeof useUIDesignToolAPI>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const status = useUIDesignToolStatus();

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
