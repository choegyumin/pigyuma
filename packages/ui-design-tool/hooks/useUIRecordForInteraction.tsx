import { useContextForSubscribe } from '@/components/Workspace/Workspace.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useForceUpdate } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { useEffect } from 'react';

export default function useUIRecordForInteraction(recordKey: UIRecordKey | undefined) {
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
      // 렌더링 된 DOM을 기반으로 동작하는 컴포넌트에서 사용하므로, 상태 변경이 일어난 이후 dipatch를 유발함
      window.requestAnimationFrame(() => {
        forceUpdate();
      });
    };
    subscribe(recordKey, callback);
    return () => {
      unsubscribe(recordKey, callback);
    };
  }, [recordKey, forceUpdate, subscribe, unsubscribe]);

  return record;
}
