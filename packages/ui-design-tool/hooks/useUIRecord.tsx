import { UIRecord } from '@/api/UIRecord/model';
import { useItemReference, useUISubscription } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useUIRecord(recordKey: UIRecordKey | undefined) {
  const { subscribeItem } = useUISubscription();
  const getRecord = useItemReference();

  /**
   * 재조정 범위 축소
   * @see useUIRecordForUI {@link @/hooks/useUIRecordForUI.tsx}
   */
  const [record, _setRecord] = useState<UIRecord | undefined>(() =>
    isUIRecordKey(recordKey) ? cloneDeep(getRecord(recordKey)) : undefined,
  );

  const setRecord = useCallback<typeof _setRecord>(
    (value) => {
      /**
       * 참조 제거 및 늦은 재조정 유발
       * @see useUIRecordForInteraction {@link @/hooks/useUIRecordForInteraction.tsx}
       */
      window.requestAnimationFrame(() => {
        _setRecord(cloneDeep(value));
      });
    },
    [_setRecord],
  );

  const firstRunRef = useRef<boolean>(true);

  useEffect(() => {
    /**
     * 첫 재조정 차단
     * @see useUIRecordForUI {@link @/hooks/useUIRecordForUI.tsx}
     */
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
      setRecord(newRecord);
    };
    const unsubscribe = subscribeItem(recordKey, callback);
    return unsubscribe;
  }, [recordKey, setRecord, subscribeItem]);

  return record;
}
