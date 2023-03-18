import { UIRecord } from '@/api/UIRecord/model';
import useItemReference from '@/hooks/useItemReference';
import useUISubscription from '@/hooks/useUISubscription';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useForceUpdate } from '@pigyuma/react-utils';
import { startTransition, useEffect, useRef } from 'react';

/** @todo 렌더링이 늦을 경우: startTransition을 RAF로 변경 (3ba4789) */
export default function useUIRecordForInteraction<T extends UIRecord>(recordKey: UIRecordKey | undefined): T | undefined {
  const forceUpdate = useForceUpdate();
  const firstRunRef = useRef<boolean>(true);

  const { subscribeTree } = useUISubscription();

  // 재조정 범위를 줄이기 위해 `useUIData` 반환 값을 사용하는 대신 직접 값에 접근
  const getRecord = useItemReference();

  // 이미 렌더링 된 UIRecord 엘리먼트에 접근해야 하므로,
  // initial state를 effect에서 설정해 렌더링 시점을 조정함
  const record = !firstRunRef.current && isUIRecordKey(recordKey) ? getRecord<T>(recordKey) : undefined;

  useEffect(() => {
    startTransition(() => {
      // 재조정 범위를 줄이기 위해 `useUIData` 반환 값을 사용하는 대신 직접 구독함
      forceUpdate();
    });
  }, [recordKey, forceUpdate]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (_: unknown, changed: UIRecord[], removed: UIRecordKey[]) => {
      const shouldUpdate = (changed.find((it) => it.key === recordKey) || removed.find((key) => key === recordKey)) != null;
      if (shouldUpdate) {
        // 이미 렌더링이 끝난 엘리먼트에 접근하기 위해 상태 변경을 지연시킴
        // (callback 실행 시점은 다른 상태 변경과 동일하지만, queue는 따로 관리되는 것으로 추측됨)
        // (startTransition의 용도와 해결하려는 문제가 서로 상충해 오히려 렌더링이 늦어질 수 있음)
        startTransition(() => {
          forceUpdate();
        });
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
