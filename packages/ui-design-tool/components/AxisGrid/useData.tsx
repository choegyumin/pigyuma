import { UIDesignToolStatus } from '@/api/UIDesignTool';
import useSelection from '@/hooks/useSelection';
import useStatus from '@/hooks/useStatus';

export default function useData() {
  const selectedRecords = useSelection();
  const status = useStatus();

  const hasSelectedOneOnly = selectedRecords.size === 1;

  const isActive = status === UIDesignToolStatus.idle && hasSelectedOneOnly;

  const selectedRecordKey = isActive ? [...selectedRecords][0]?.key : undefined;

  return {
    isActive,
    selectedRecordKey,
  };
}

export type UseDataType = ReturnType<typeof useData>;
