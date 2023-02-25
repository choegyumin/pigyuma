import { UIRecord } from '@/api/UIRecord/model';
import { useItemReference, useUISubscription } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useCloneDeepState } from '@pigyuma/react-utils';
import { useEffect } from 'react';

export default function useUIRecordForInteraction(recordKey: UIRecordKey | undefined) {
  const { subscribeItem } = useUISubscription();
  const getRecord = useItemReference();

  // 이미 렌더링 된 UIRecord 엘리먼트에 접근해야 하므로,
  // initial state를 effect에서 설정해 렌더링 시점을 조정함
  const [record, setRecord] = useCloneDeepState<UIRecord | undefined>(undefined);

  useEffect(() => {
    const requestId = window.requestAnimationFrame(() => {
      setRecord(isUIRecordKey(recordKey) ? getRecord(recordKey) : undefined);
    });
    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, [recordKey, setRecord, getRecord]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    let requestId = -1;
    const callback = (newRecord: UIRecord | undefined) => {
      // 이미 렌더링 된 UIRecord 엘리먼트에 접근해야 하므로,
      // UIRecord 컴포넌트의 재조정이 일어난 직후 dipatch를 실행해 늦은 재조정을 유발함
      // 렌더링 시점에 오차가 발생하지만 free transform 시 handle을 숨겨 눈에 띄지 않음
      window.cancelAnimationFrame(requestId);
      requestId = window.requestAnimationFrame(() => {
        setRecord(newRecord);
      });
    };
    const unsubscribe = subscribeItem(recordKey, callback);
    return () => {
      unsubscribe();
      window.cancelAnimationFrame(requestId);
    };
  }, [recordKey, setRecord, subscribeItem]);

  return record;
}
