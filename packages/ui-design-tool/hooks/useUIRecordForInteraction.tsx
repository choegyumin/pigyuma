import { UIRecord } from '@/api/UIRecord/model';
import { useItemReference, useUISubscription } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useCloneDeepState } from '@pigyuma/react-utils';
import { startTransition, useEffect } from 'react';

/** @todo 렌더링이 늦을 경우: startTransition을 RAF로 변경 (3ba4789) */
export default function useUIRecordForInteraction<T extends UIRecord>(recordKey: UIRecordKey | undefined): T | undefined {
  const { subscribeItem } = useUISubscription();
  const getRecord = useItemReference();

  // 이미 렌더링 된 UIRecord 엘리먼트에 접근해야 하므로,
  // initial state를 effect에서 설정해 렌더링 시점을 조정함
  const [record, setRecord] = useCloneDeepState<T | undefined>(undefined);

  useEffect(() => {
    startTransition(() => {
      setRecord(isUIRecordKey(recordKey) ? (getRecord(recordKey) as T) : undefined);
    });
  }, [recordKey, setRecord, getRecord]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord | undefined) => {
      // 이미 렌더링이 끝난 엘리먼트에 접근하기 위해 상태 변경을 지연시킴
      // (callback 실행 시점은 다른 상태 변경과 동일하지만, queue는 따로 관리되는 것으로 추측됨)
      // (startTransition의 용도와 해결하려는 문제가 서로 상충해 오히려 렌더링이 늦어질 수 있음)
      startTransition(() => {
        setRecord(newRecord as T);
      });
    };
    const unsubscribe = subscribeItem(recordKey, callback);
    return unsubscribe;
  }, [recordKey, setRecord, subscribeItem]);

  return record;
}
