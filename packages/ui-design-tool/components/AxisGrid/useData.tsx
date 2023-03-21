import { StatusType } from '@/api/UIDesignTool';
import useSelected from '@/hooks/useSelected';
import useStatus from '@/hooks/useStatus';

export default function useData() {
  const selectedKeys = useSelected();
  const status = useStatus();

  const hasSelectedOneOnly = selectedKeys.size === 1;

  const isActive = status.statusType === StatusType.idle && hasSelectedOneOnly;

  const selectedRecordKey = isActive ? [...selectedKeys][0] : undefined;

  return {
    isActive,
    selectedRecordKey,
  };
}

export type UseDataType = ReturnType<typeof useData>;
