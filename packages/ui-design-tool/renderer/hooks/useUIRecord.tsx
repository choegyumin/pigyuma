import { UIRecord } from '@/models/UIRecord/model';
import useItemReference from '@/renderer/hooks/useItemReference';
import useUISubscriber from '@/renderer/hooks/useUISubscriber';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useForceUpdate } from '@pigyuma/react-utils';
import { useEffect, useLayoutEffect, useRef } from 'react';

export default function useUIRecord<T extends UIRecord>(recordKey: UIRecordKey | undefined): T | undefined {
  const forceUpdate = useForceUpdate();
  const firstRunRef = useRef<boolean>(true);

  const { subscribeTree } = useUISubscriber();

  // 재조정 범위를 줄이기 위해 `useUIData` 반환 값을 사용하는 대신 직접 값에 접근
  const getRecord = useItemReference();

  const record = isUIRecordKey(recordKey) ? getRecord<T>(recordKey) : undefined;

  useLayoutEffect(() => {
    // 최초 발생한 effect는 무시해 재조정을 차단함
    if (!firstRunRef.current) {
      // https://codesandbox.io/s/useeffect-vs-uselayouteffect-vs-flushsync-1k9yg9
      forceUpdate();
    }
  }, [recordKey, forceUpdate]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (_: unknown, changed: UIRecord[], removed: UIRecordKey[]) => {
      const shouldUpdate = (changed.find((it) => it.key === recordKey) || removed.find((key) => key === recordKey)) != null;
      if (shouldUpdate) {
        forceUpdate();
      }
    };
    const unsubscribe = subscribeTree(callback);
    return unsubscribe;
  }, [recordKey, subscribeTree, forceUpdate]);

  useEffect(() => {
    setRef(firstRunRef, false);
  }, []);

  return record;
}
