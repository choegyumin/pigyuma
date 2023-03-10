import { Canvas } from '@/api/Canvas/model';
import { BrowserMeta, INITIAL_BROWSER_META, INITIAL_INSTANCE_ID, UIDesignTool, UIDesignToolStatus } from '@/api/UIDesignTool';
import { UIRecord } from '@/api/UIRecord/model';
import { UIRecordKey } from '@/types/Identifier';
import { setRef, useCloneDeepState, useStableCallback } from '@pigyuma/react-utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useContextValue(initialValues: { api: UIDesignTool }) {
  const { api } = initialValues;

  const privateRef = useRef<{
    id: string;
    getBrowserMeta: () => BrowserMeta;
    setStatus: React.Dispatch<UIDesignToolStatus>;
  }>({
    id: INITIAL_INSTANCE_ID,
    getBrowserMeta: () => INITIAL_BROWSER_META,
    setStatus: () => undefined,
  });

  const instanceId = privateRef.current.id;
  const getBrowserMeta = useCallback(() => privateRef.current.getBrowserMeta(), []);

  /**
   * @todo 상태를 세분화해야 하는지 검토
   * @todo XState 도입 검토 (상태를 context에서 관리하고 constate로 분리하지 않아도 InteractionController 내에서 눈에 띄는 성능 저하는 없을 것으로 판단됨)
   */
  const [status, setStatus] = useState<UIDesignToolStatus>(UIDesignToolStatus.idle);
  privateRef.current.setStatus(status);
  // const [interaction, setInteraction] = useState<UIDesignToolInteractionStatus>(UIDesignToolInteractionStatus.idle);
  // const status = useMemo<UIDesignToolStatus>(() => {
  //   switch (interaction) {
  //     case UIDesignToolInteractionStatus.resizing:
  //     case UIDesignToolInteractionStatus.resizingFromCenter:
  //     case UIDesignToolInteractionStatus.resizingCorner:
  //     case UIDesignToolInteractionStatus.resizingCornerFromCenter:
  //       return UIDesignToolStatus.resizing;
  //     case UIDesignToolInteractionStatus.rotating:
  //       return UIDesignToolStatus.rotating;
  //     case UIDesignToolInteractionStatus.selecting:
  //       return UIDesignToolStatus.selecting;
  //     case UIDesignToolInteractionStatus.idle:
  //       return UIDesignToolStatus.idle;
  //     default:
  //       return UIDesignToolStatus.unknown;
  //   }
  // }, [interaction]);

  const [cursor, setCursor] = useState<NonNullable<React.CSSProperties['cursor']>>('default');

  const dispatcher = useMemo(
    () => ({
      setCursor,
      setStatus,
    }),
    [setCursor, setStatus],
  );

  /**
   * 참조 제거
   * @see useUIRecord {@link @/hooks/useUIRecord.tsx}
   * @todo 성능 저하가 발생하면: 최초 한번 cloneDeep 후, 변경된 아이템만 clone하도록 개선
   */
  const [pairs, setPairs] = useCloneDeepState<Map<UIRecordKey, UIRecord>>(() => api.pairs);
  const [tree, setTree] = useCloneDeepState<Canvas>(() => api.tree);
  const [selection, setSelection] = useCloneDeepState<Set<UIRecord>>(() => api.selection);

  // 필요 시 react 컴포넌트 내에서 상태가 아닌 인스턴스 값에 직접 접근
  const getItemReference = useStableCallback(((...args) => api.get(...args)) as typeof api.get);
  const getTreeReference = useStableCallback(() => api.tree);
  const getPairsReference = useStableCallback(() => api.pairs);
  const getSelectionReference = useStableCallback(() => api.selection);

  const controllerInterface = useMemo(
    () => ({
      reset: ((...args) => api.reset(...args)) as typeof api.reset,
      select: ((...args) => api.select(...args)) as typeof api.select,
      set: ((...args) => api.set(...args)) as typeof api.set,
      setRect: ((...args) => api.setRect(...args)) as typeof api.setRect,
      move: ((...args) => api.move(...args)) as typeof api.move,
      append: ((...args) => api.append(...args)) as typeof api.append,
      prepend: ((...args) => api.prepend(...args)) as typeof api.prepend,
      insertBefore: ((...args) => api.insertBefore(...args)) as typeof api.insertBefore,
      insertAfter: ((...args) => api.insertAfter(...args)) as typeof api.insertAfter,
      remove: ((...args) => api.remove(...args)) as typeof api.remove,
    }),
    [api],
  );

  const dataInterface = useMemo(
    () => ({
      status,
      get: ((targetKey) => pairs.get(targetKey)) as typeof api.get,
      has: ((targetKey) => pairs.has(targetKey)) as typeof api.has,
      pairs,
      tree,
      selection,
      isSelected: ((targetKey) => [...selection].find(({ key }) => key === targetKey) != null) as typeof api.isSelected,
    }),
    [api, status, pairs, tree, selection],
  );

  const elementInterface = useMemo(
    () => ({
      dataset: ((...args) => api.dataset(...args)) as typeof api.dataset,
      matches: ((...args) => api.matches(...args)) as typeof api.matches,
      closest: ((...args) => api.closest(...args)) as typeof api.closest,
      query: ((...args) => api.query(...args)) as typeof api.query,
      queryAll: ((...args) => api.queryAll(...args)) as typeof api.queryAll,
      fromPoint: ((...args) => api.fromPoint(...args)) as typeof api.fromPoint,
      fromMouse: ((...args) => api.fromMouse(...args)) as typeof api.fromMouse,
    }),
    [api],
  );

  // `useEffect`와 유사한 형태로 Clean-up 함수(unsubscribe) 제공
  const subscriptionInterface = useMemo(
    () => ({
      subscribeItem: (...args: Parameters<typeof api.subscribeItem>): (() => void) => {
        api.subscribeItem(...args);
        const unsubscribe = () => api.unsubscribeItem(...args);
        return unsubscribe;
      },
      subscribeTree: (...args: Parameters<typeof api.subscribeTree>): (() => void) => {
        api.subscribeTree(...args);
        const unsubscribe = () => api.unsubscribeTree(...args);
        return unsubscribe;
      },
      subscribeSelection: (...args: Parameters<typeof api.subscribeSelection>): (() => void) => {
        api.subscribeSelection(...args);
        const unsubscribe = () => api.unsubscribeSelection(...args);
        return unsubscribe;
      },
    }),
    [api],
  );

  useEffect(() => {
    const { id, getBrowserMeta, setStatus } = api.mount();
    setRef(privateRef, {
      id,
      getBrowserMeta,
      setStatus,
    });
    return () => {
      setRef(privateRef, {
        id,
        getBrowserMeta: () => INITIAL_BROWSER_META,
        setStatus: () => undefined,
      });
      api.unmount();
    };
  }, [api]);

  useEffect(() => {
    const callback = () => {
      setPairs(api.pairs);
      setTree(api.tree);
      // `selection`를 읽는 컴포넌트도 전체 데이터가 변경되었을 때 재조정 대상에 포함
      setSelection(api.selection);
    };
    const unsubscribe = api.subscribeTree(callback);
    return unsubscribe;
  }, [api, setPairs, setTree, setSelection]);

  useEffect(() => {
    const callback = () => {
      setSelection(api.selection);
    };
    const unsubscribe = api.subscribeSelection(callback);
    return unsubscribe;
  }, [api, setSelection]);

  return {
    instanceId,
    getBrowserMeta,
    status,
    cursor,
    dispatcher,

    getItemReference,
    tree,
    getTreeReference,
    pairs,
    getPairsReference,
    selection,
    getSelectionReference,

    controllerInterface,
    dataInterface,
    elementInterface,
    subscriptionInterface,
  };
}
