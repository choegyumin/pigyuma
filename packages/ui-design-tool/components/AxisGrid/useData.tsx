import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useContextForInteraction } from '../Workspace/Workspace.context';

export type UseDataDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const { context } = deps;

  const hasSelectedOneOnly = context.selectedRecords.size === 1;

  const isActive = context.status === UIDesignToolStatus.idle && hasSelectedOneOnly;

  const [selectedRecordKey] = isActive ? context.selectedRecords.keys() : ([] as undefined[]);

  return {
    isActive,
    selectedRecordKey,
  };
}

export type UseDataType = ReturnType<typeof useData>;
