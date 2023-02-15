import { UIRecord } from '@/api/UIRecord/model';
import { useUIDesignToolAPI } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useState } from 'react';

export default function useUIRecordPairs() {
  const { getPairs, subscribeTree, unsubscribeTree } = useUIDesignToolAPI();

  const [pairs, _setPairs] = useState<Map<UIRecordKey, UIRecord>>(() => cloneDeep(getPairs()));

  const setPairs = useCallback<typeof _setPairs>(
    (value) => {
      /**
       * 참조 제거 및 늦은 재조정 유발
       * @see useUIRecordForInteraction {@link @/hooks/useUIRecordForInteraction.tsx}
       */
      window.requestAnimationFrame(() => {
        _setPairs(cloneDeep(value));
      });
    },
    [_setPairs],
  );

  useEffect(() => {
    const callback = () => {
      setPairs(getPairs());
    };
    subscribeTree(callback);
    return () => {
      unsubscribeTree(callback);
    };
  }, [setPairs, getPairs, subscribeTree, unsubscribeTree]);

  return pairs;
}
