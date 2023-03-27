import { UIRecord } from '@/api/UIRecord/model';
import useItemReference from '@/hooks/useItemReference';
import useUISubscription from '@/hooks/useUISubscription';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useForceUpdate } from '@pigyuma/react-utils';
import { startTransition, useEffect, useRef } from 'react';

/** @todo 렌더링이 눈에 띄게 늦어질 경우: startTransition을 RAF로 변경 (3ba4789) */
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
      forceUpdate();
    });
  }, [recordKey, forceUpdate]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = () => {
      // 이미 렌더링이 끝난 엘리먼트에 접근하기 위해 상태 변경을 지연시킴
      // (callback 실행 시점은 다른 상태 변경과 동일하지만, queue는 따로 관리되는 것으로 추측됨)
      startTransition(() => {
        // 다른 record의 변경으로 인한 엘리먼트의 리렌더링도 감지해야 하므로,
        // tree의 모든 record 변경을 구독하도록 조건을 걸지 않음
        forceUpdate();
      });
    };
    const unsubscribe = subscribeTree(callback);
    return unsubscribe;
  }, [recordKey, subscribeTree, forceUpdate]);

  useEffect(() => {
    setRef(firstRunRef, false);
  }, []);

  return record;
}
