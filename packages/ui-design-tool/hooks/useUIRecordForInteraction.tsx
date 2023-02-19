import { UIRecord } from '@/api/UIRecord/model';
import { useItemReference, useUISubscription } from '@/components/UIDesignToolProvider/UIDesignToolProvider.context';
import { UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useCloneDeepState } from '@pigyuma/react-utils';
import { useEffect } from 'react';

/**
 * @todo 버그가 발생하면: 상태 업데이트를 RAF 대신 지연시킬 수 있는 방법 리서치
 *     - react-reconciler로 커스텀 ReactDOM을 만들거나, react를 대체하는 라이브러리를 구현하기에는
 *       프로젝트의 계획과 규모에 맞지 않게 큰 비용이 듦
 */
export default function useUIRecordForInteraction(recordKey: UIRecordKey | undefined) {
  const { subscribeItem } = useUISubscription();
  const getRecord = useItemReference();

  // - 재조정 범위를 줄이기 위해 `useUIData` 반환 값을 사용하지 않고, 직접 구독해서 상태 관리
  //   React와 상태 관리 주기를 맞추기 위해 참조를 끊음
  // - 렌더링 된 UIRecord 엘리먼트를 읽어야 작동하는 컴포넌트에서 쓰이므로,
  //   initial state를 effect에서 업데이트 해 렌더링 시점을 조정함
  const [record, setRecord] = useCloneDeepState<UIRecord | undefined>(undefined);

  useEffect(() => {
    // 렌더링 된 UIRecord 엘리먼트를 읽어야 작동하는 컴포넌트에서 쓰이므로,
    // UIRecord 컴포넌트의 재조정이 일어난 직후 dipatch를 실행해 늦은 재조정을 유발함
    window.requestAnimationFrame(() => {
      setRecord(isUIRecordKey(recordKey) ? getRecord(recordKey) : undefined);
    });
  }, [recordKey, setRecord, getRecord]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord | undefined) => {
      // 렌더링 된 UIRecord 엘리먼트를 읽어야 작동하는 컴포넌트에서 쓰이므로,
      // UIRecord 컴포넌트의 재조정이 일어난 직후 dipatch를 실행해 늦은 재조정을 유발함
      window.requestAnimationFrame(() => {
        setRecord(newRecord);
      });
    };
    const unsubscribe = subscribeItem(recordKey, callback);
    return unsubscribe;
  }, [recordKey, setRecord, subscribeItem]);

  return record;
}
