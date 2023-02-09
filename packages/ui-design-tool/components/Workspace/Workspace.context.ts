import { pick } from '@pigyuma/utils';
import constate from 'constate';
import useContextValue from './useContextValue';

/** @see UIRecordIdentifiers */
export type UIRecordElementFilterItem = {
  key?: string;
  type?: string | string[];
  layerType?: string | string[];
};
export type UIRecordElementFilter = UIRecordElementFilterItem | UIRecordElementFilterItem[];

/**
 * `UIDesignToolAPI` 메서드 모음
 * 메서드 함수는 reference가 항상 동일해야 함
 */
export const uiDesignToolAPIMethods = [
  'getStatus',
  'getInteraction',
  'subscribe',
  'unsubscribe',
  'get',
  'getAll',
  'getSelected',
  'select',
  'set',
  'setRect',
  'move',
  'append',
  'prepend',
  'insertBefore',
  'insertAfter',
  'remove',
  'matches',
  'closest',
  'query',
  'queryAll',
  'fromPoint',
  'fromMouse',
] as const;
export type UIDesignToolAPIMethods = ArrayElements<typeof uiDesignToolAPIMethods>;

/**
 * `record` 를 가져오고 변경을 구독하기 위해 사용하는 컨텍스트 키 모음
 * reconciliation을 유발하지 않는 상태 및 함수만 가져와야 함
 */
export const contextKeysForSubscribe = ['subscribe', 'unsubscribe', 'get'] as const;
export type ContextKeysForSubscribe = ArrayElements<typeof contextKeysForSubscribe>;

/**
 * 인터랙션 제어를 위해 컴포넌트에서 사용하는 컨텍스트 키 모음
 * `records` 데이터 추출 및 조작 메서드와 의도적으로 reconciliation을 유발하는 상태 및 함수만 가져와야 함 (의도치 않은 reconciliation이 발생해서는 안됨)
 */
export const contextKeysForInteraction = [
  'getBrowserMeta',
  'cursor',
  'setCursor',
  'status',
  'interaction',
  'setInteraction',
  'subscribe',
  'unsubscribe',
  'records',
  'selectedRecords',
  'get',
  'select',
  'set',
  'setRect',
  'move',
  'append',
  'prepend',
  'insertBefore',
  'insertAfter',
  'remove',
  'matches',
  'closest',
  'query',
  'queryAll',
  'fromPoint',
  'fromMouse',
] as const;
export type ContextKeysForInteraction = ArrayElements<typeof contextKeysForInteraction>;

export const [WorkspaceContextProvider, useUIDesignToolAPI, useContextForSubscribe, useContextForInteraction] = constate(
  useContextValue,
  (value) => pick(value, uiDesignToolAPIMethods),
  (value) => pick(value, contextKeysForSubscribe),
  (value) => pick(value, contextKeysForInteraction),
);

export type UIDesignToolAPI = ReturnType<typeof useUIDesignToolAPI>;
