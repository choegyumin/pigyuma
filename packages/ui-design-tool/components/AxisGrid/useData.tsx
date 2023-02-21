import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useSelected, useStatus } from '@/hooks';

export default function useData() {
  const selectedRecords = useSelected();
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
