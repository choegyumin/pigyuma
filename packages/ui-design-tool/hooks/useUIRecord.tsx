import { UIRecord } from '@/api/UIRecord/model';
import { useUIDesignToolAPI } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useUIRecord(recordKey: UIRecordKey | undefined) {
  const { get, subscribeItem, unsubscribeItem } = useUIDesignToolAPI();

  const [record, _setRecord] = useState<UIRecord | undefined>(() => (isUIRecordKey(recordKey) ? cloneDeep(get(recordKey)) : undefined));

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
    setRecord(isUIRecordKey(recordKey) ? get(recordKey) : undefined);
  }, [recordKey, setRecord, get]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord) => {
      setRecord(newRecord);
    };
    subscribeItem(recordKey, callback);
    return () => {
      unsubscribeItem(recordKey, callback);
    };
  }, [recordKey, setRecord, subscribeItem, unsubscribeItem]);

  return record;
}
