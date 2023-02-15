import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useUIDesignToolStatus, useUIDesignToolAPI } from '@/hooks';
import useSelectedUIRecords from '@/hooks/useSelectedUIRecords';

export type UseDataDependencys = {
  api: ReturnType<typeof useUIDesignToolAPI>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const selectedRecords = useSelectedUIRecords();
  const status = useUIDesignToolStatus();

  const hasSelectedOneOnly = selectedRecords.size === 1;

  const isActive = status === UIDesignToolStatus.idle && hasSelectedOneOnly;

  const selectedRecordKey = isActive ? [...selectedRecords][0]?.key : undefined;

  return {
    isActive,
    selectedRecordKey,
  };
}

export type UseDataType = ReturnType<typeof useData>;
