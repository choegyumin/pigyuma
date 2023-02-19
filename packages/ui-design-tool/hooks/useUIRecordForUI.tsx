import { UIRecord } from '@/api/UIRecord/model';
import { useItemReference, useUISubscription } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useIsomorphicLayoutEffect } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useUIRecordForUI(recordKey: UIRecordKey | undefined) {
  const { subscribeItem } = useUISubscription();
  const getRecord = useItemReference();

  // 재조정 범위를 줄이기 위해 `useUIData` 반환 값을 사용하지 않고, 직접 구독해서 상태 관리
  const [record, _setRecord] = useState<UIRecord | undefined>(() =>
    isUIRecordKey(recordKey) ? cloneDeep(getRecord(recordKey)) : undefined,
  );

  const setRecord = useCallback<typeof _setRecord>(
    (value) => {
      // 상태 관리를 React에 의존하기 위해 `cloneDeep()` 으로 참조를 끊음
      _setRecord(cloneDeep(value));
    },
    [_setRecord],
  );

  const firstRunRef = useRef<boolean>(true);

  // 가능하면 browser painting 이전에 상태 변경이 이뤄지도록 함
  useIsomorphicLayoutEffect(() => {
    // initial state와 값이 동일하지만 참조는 항상 끊어지므로, 최초 발생한 effect를 무시해 재조정을 차단함
    if (firstRunRef.current) {
      return setRef(firstRunRef, false);
    }
    setRecord(isUIRecordKey(recordKey) ? getRecord(recordKey) : undefined);
  }, [recordKey, setRecord, getRecord]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord | undefined) => {
      setRecord(cloneDeep(newRecord));
    };
    const unsubscribe = subscribeItem(recordKey, callback);
    return unsubscribe;
  }, [recordKey, setRecord, subscribeItem]);

  return record;
}
