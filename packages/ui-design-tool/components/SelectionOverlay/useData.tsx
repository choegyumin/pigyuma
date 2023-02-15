import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { UIRecordKey } from '@/types/Identifier';
import { useRef, useState } from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';

export type UseDataDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const { context } = deps;

  const isActive = context.status === UIDesignToolStatus.idle || context.status === UIDesignToolStatus.selecting;

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
