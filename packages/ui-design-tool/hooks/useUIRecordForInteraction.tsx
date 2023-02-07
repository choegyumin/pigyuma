import { useContextForSubscribe } from '@/components/Workspace/Workspace.context';
import { UIRecordKey } from '@/types/Identifier';
import { UIRecord } from '@/ui-models/UIRecord/model';
import { isUIRecordKey } from '@/utils/model';
import { cloneDeep } from '@pigyuma/utils';
import { useCallback, useEffect, useState } from 'react';

export default function useUIRecordForInteraction(recordKey: UIRecordKey | undefined) {
  const { get, subscribe, unsubscribe } = useContextForSubscribe();

  // 렌더링 된 UIRecord 엘리먼트를 읽어야 작동하는 컴포넌트에서 쓰이므로,
  // initial state를 effect에서 업데이트 해 렌더링 시점을 조정함
  const [record, _setRecord] = useState<UIRecord | undefined>(undefined);

  const setRecord = useCallback<typeof _setRecord>(
    (value) => {
      // 렌더링 된 UIRecord 엘리먼트를 읽어야 작동하는 컴포넌트에서 쓰이므로,
      // UIRecord 컴포넌트의 재조정이 일어난 직후 dipatch를 실행해 늦은 재조정을 유발함
      // react-reconciler로 커스텀 ReactDOM을 만들거나, react를 대체하는 라이브러리를 구현하기에는
      // 프로젝트의 계획과 규모에 맞지 않게 큰 비용이 듦으로 문제가 발생하면 그때 해결
      window.requestAnimationFrame(() => {
        // 상태 관리를 React에 의존하기 위해 `cloneDeep()` 으로 참조를 끊음
        _setRecord(cloneDeep(value));
      });
    },
    [_setRecord],
  );

  useEffect(() => {
    setRecord(isUIRecordKey(recordKey) ? get(recordKey) : undefined);
  }, [recordKey, setRecord, get]);

  useEffect(() => {
    if (!isUIRecordKey(recordKey)) {
      return;
    }
    const callback = (newRecord: UIRecord) => {
      setRecord(newRecord);
    };
    subscribe(recordKey, callback);
    return () => {
      unsubscribe(recordKey, callback);
    };
  }, [recordKey, setRecord, subscribe, unsubscribe]);

  return record;
}
