import { useContextForSubscribe } from '@/components/Workspace/Workspace.context';
import { UIRecordKey } from '@/types/Identifier';
import { UIRecord } from '@/ui-models/UIRecord/model';
import { isUIRecordKey } from '@/utils/model';
import { setRef } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useUIRecord(recordKey: UIRecordKey | undefined) {
  const { get, subscribe, unsubscribe } = useContextForSubscribe();

  // 상태 관리를 React에 의존하기 위해 `cloneDeep()` 으로 참조를 끊음
  const [record, _setRecord] = useState<UIRecord | undefined>(() => (isUIRecordKey(recordKey) ? cloneDeep(get(recordKey)) : undefined));

  const setRecord = useCallback<typeof _setRecord>(
    (value) => {
      // 상태 관리를 React에 의존하기 위해 `cloneDeep()` 으로 참조를 끊음
      _setRecord(cloneDeep(value));
    },
    [_setRecord],
  );

  const firstRunRef = useRef<boolean>(true);
  useEffect(() => {
    // initial state와 값이 동일하지만 참조는 항상 끊어지므로, 최초 발생한 effect를 무시해 재조정을 차단함
    if (firstRunRef.current) {
      return setRef(firstRunRef, false);
    }
    setRecord(isUIRecordKey(recordKey) ? get(recordKey) : undefined);
  }, [recordKey, setRecord, get]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord) => {
      setRecord(cloneDeep(newRecord));
    };
    subscribe(recordKey, callback);
    return () => {
      unsubscribe(recordKey, callback);
    };
  }, [recordKey, setRecord, subscribe, unsubscribe]);

  return record;
}
