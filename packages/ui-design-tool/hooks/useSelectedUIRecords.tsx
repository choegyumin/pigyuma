import { UIRecord } from '@/api/UIRecord/model';
import { useUIDesignToolAPI } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useState } from 'react';

export default function useSelectedUIRecords() {
  const { getSelected, subscribeSelection, unsubscribeSelection } = useUIDesignToolAPI();

  const [selected, _setSelected] = useState<Set<UIRecord>>(() => cloneDeep(getSelected()));

  const setSelected = useCallback<typeof _setSelected>(
    (value) => {
      /**
       * 참조 제거 및 늦은 재조정 유발
       * @see useUIRecordForInteraction {@link @/hooks/useUIRecordForInteraction.tsx}
       */
      window.requestAnimationFrame(() => {
        _setSelected(cloneDeep(value));
      });
    },
    [_setSelected],
  );

  useEffect(() => {
    const callback = () => {
      setSelected(getSelected());
    };
    subscribeSelection(callback);
    return () => {
      unsubscribeSelection(callback);
    };
  }, [setSelected, getSelected, subscribeSelection, unsubscribeSelection]);

  return selected;
}
