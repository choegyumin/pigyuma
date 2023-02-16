import { UIRecord } from '@/api/UIRecord/model';
import { useItemReference, useUISubscription } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useCloneDeepState } from '@pigyuma/react-utils';
import { useEffect, useRef } from 'react';

export default function useUIRecord(recordKey: UIRecordKey | undefined) {
  const { subscribeItem, unsubscribeItem } = useUISubscription();
  const getRecord = useItemReference();

  /**
   * 참조 제거 및 재조정 범위 축소
   * @see useUIRecordForUI {@link @/hooks/useUIRecordForUI.tsx}
   */
  const [record, setRecord] = useCloneDeepState<UIRecord | undefined>(() => (isUIRecordKey(recordKey) ? getRecord(recordKey) : undefined));

  const firstRunRef = useRef<boolean>(true);

  useEffect(() => {
    /**
     * 첫 재조정 차단
     * @see useUIRecordForUI {@link @/hooks/useUIRecordForUI.tsx}
     */
    if (firstRunRef.current) {
      return setRef(firstRunRef, false);
    }
    /**
     * 늦은 재조정 유발
     * @see useUIRecordForInteraction {@link @/hooks/useUIRecordForInteraction.tsx}
     */
    window.requestAnimationFrame(() => {
      setRecord(isUIRecordKey(recordKey) ? getRecord(recordKey) : undefined);
    });
  }, [recordKey, setRecord, getRecord]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord) => {
      /**
       * 늦은 재조정 유발
       * @see useUIRecordForInteraction {@link @/hooks/useUIRecordForInteraction.tsx}
       */
      window.requestAnimationFrame(() => {
        setRecord(newRecord);
      });
    };
    subscribeItem(recordKey, callback);
    return () => {
      unsubscribeItem(recordKey, callback);
    };
  }, [recordKey, setRecord, subscribeItem, unsubscribeItem]);

  return record;
}
