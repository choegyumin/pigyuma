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

export const [WorkspaceContextProvider, useUIDesignToolAPI, useContextForSubscribe] = constate(
  useContextValue,
  (value) => pick(value, uiDesignToolAPIMethods),
  (value) => pick(value, contextKeysForSubscribe),
);

export type UIDesignToolAPI = ReturnType<typeof useUIDesignToolAPI>;
