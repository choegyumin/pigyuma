import { Canvas } from '@/api/Canvas/model';
import { useUIDesignToolAPI } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useState } from 'react';

export default function useUIRecordTree() {
  const { getTree, subscribeTree, unsubscribeTree } = useUIDesignToolAPI();

  const [tree, _setTree] = useState<Canvas>(() => cloneDeep(getTree()));

  const setTree = useCallback<typeof _setTree>(
    (value) => {
      /**
       * 참조 제거 및 늦은 재조정 유발
       * @see useUIRecordForInteraction {@link @/hooks/useUIRecordForInteraction.tsx}
       */
      window.requestAnimationFrame(() => {
        _setTree(cloneDeep(value));
      });
    },
    [_setTree],
  );

  useEffect(() => {
    const callback = () => {
      setTree(getTree());
    };
    subscribeTree(callback);
    return () => {
      unsubscribeTree(callback);
    };
  }, [setTree, getTree, subscribeTree, unsubscribeTree]);

  return tree;
}
