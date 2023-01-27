import { useContextForSubscribe } from '@/components/Workspace/Workspace.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useForceUpdate } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { useEffect } from 'react';

export default function useUIRecord(recordKey: UIRecordKey | undefined) {
  const forceUpdate = useForceUpdate();

  const { get, subscribe, unsubscribe } = useContextForSubscribe();

  // `WorkspaceContext` 의 `get()` 과는 다르게, 상태 관리를 React에 의존하기 위해 `cloneDeep()` 으로 레퍼런스를 끊음
  const record = recordKey != null ? cloneDeep(get(recordKey)) : undefined;

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      forceUpdate();
      return;
    }
    const callback = () => {
      forceUpdate();
    };
    subscribe(recordKey, callback);
    return () => {
      unsubscribe(recordKey, callback);
    };
  }, [recordKey, forceUpdate, subscribe, unsubscribe]);

  return record;
}
