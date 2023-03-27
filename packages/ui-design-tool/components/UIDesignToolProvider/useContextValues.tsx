import { Canvas } from '@/api/Canvas/model';
import { INITIAL_BROWSER_META, INITIAL_INSTANCE_ID, UIDesignTool } from '@/api/UIDesignTool';
import { UIRecord } from '@/api/UIRecord/model';
import { BrowserMeta } from '@/types/Browser';
import { UIRecordKey } from '@/types/Identifier';
import { UIDesignToolMode, UIDesignToolStatus, UIDesignToolStatusMeta } from '@/types/Status';
import { setRef, useCloneDeepState, useStableCallback } from '@pigyuma/react-utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useContextValues(initialValues: { api: UIDesignTool }) {
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
  const getBrowserMeta = useCallback(
    (...args: Parameters<typeof privateRef.current.getBrowserMeta>) => privateRef.current.getBrowserMeta(...args),
    [],
  );
  const setStatusDispatcher = useCallback(
    (...args: Parameters<typeof privateRef.current.setStatus>) => privateRef.current.setStatus(...args),
    [],
  );

  const [cursor, setCursor] = useState<NonNullable<React.CSSProperties['cursor']>>('default');
  const [hovered, setHovered] = useState<UIRecordKey>();

  const dispatcher = useMemo(
    () => ({
      setCursor,
      setHovered,
      setStatus: setStatusDispatcher,
    }),
    [setCursor, setHovered, setStatusDispatcher],
  );

  const [mode, setMode] = useState<UIDesignToolMode>(() => api.mode);
  const [status, setStatus] = useState<UIDesignToolStatus>(() => api.status);
  const [statusMeta, setStatueMeta] = useState<UIDesignToolStatusMeta>(() => ({
    interactionType: api.interactionType,
    transformMethod: api.transformMethod,
  }));

  /**
   * 상태의 Life cycle을 React에 의존하기 위해 참조 제거
   * @todo 성능 저하가 발생하면: 최초 한번 cloneDeep 후, 변경된 아이템만 clone하도록 개선
   */
  const [pairs, setPairs] = useCloneDeepState<typeof api.pairs>(() => api.pairs);
  const tree = useMemo<typeof api.tree>(() => pairs.get(Canvas.key) as Canvas, [pairs]);
  const [selected, setSelected] = useCloneDeepState<typeof api.selected>(() => api.selected);

  const controllerInterface = useMemo(
    () => ({
      toggleMode: ((...args) => api.toggleMode(...args)) as typeof api.toggleMode,
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
      mode,
      status,
      get: ((targetKey) => pairs.get(targetKey)) as typeof api.get,
      has: ((targetKey) => pairs.has(targetKey)) as typeof api.has,
      pairs,
      tree,
      selected,
      isSelected: ((targetKey) => selected.has(targetKey)) as typeof api.isSelected,
    }),
    [api, mode, status, pairs, tree, selected],
  );

  const selectorInterface = useMemo(
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

  // unsubscribe 함수를 `useEffect`의 Clean-up 함수 형태로 제공
  const subscriptionInterface = useMemo(
    () => ({
      subscribeMode: (...args: Parameters<typeof api.subscribeMode>): (() => void) => {
        api.subscribeMode(...args);
        const unsubscribe = () => api.unsubscribeMode(...args);
        return unsubscribe;
      },
      subscribeStatus: (...args: Parameters<typeof api.subscribeStatus>): (() => void) => {
        api.subscribeStatus(...args);
        const unsubscribe = () => api.unsubscribeStatus(...args);
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

  // 필요 시 React의 Life cycle을 무시하고 값에 직접 접근
  const getItemReference = useStableCallback(((...args) => dataInterface.get(...args)) as typeof api.get);
  const getTreeReference = useStableCallback(() => dataInterface.tree);
  const getPairsReference = useStableCallback(() => dataInterface.pairs);
  const getSelectedReference = useStableCallback(() => dataInterface.selected);

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
    const callback = (mode: UIDesignToolMode) => {
      setMode(mode);
    };
    const unsubscribe = subscriptionInterface.subscribeMode(callback);
    return unsubscribe;
  }, [api, subscriptionInterface, setMode]);

  useEffect(() => {
    const callback = (status: UIDesignToolStatus, meta: UIDesignToolStatusMeta) => {
      setStatus(status);
      setStatueMeta(meta);
    };
    const unsubscribe = subscriptionInterface.subscribeStatus(callback);
    return unsubscribe;
  }, [api, subscriptionInterface, setStatus, setStatueMeta]);

  useEffect(() => {
    const callback = (all: UIRecord[]) => {
      setPairs(new Map(all.map((it) => [it.key, it])));
    };
    const unsubscribe = subscriptionInterface.subscribeTree(callback);
    return unsubscribe;
  }, [api, subscriptionInterface, setPairs]);

  useEffect(() => {
    const callback = (newSelected: UIRecordKey[]) => {
      setSelected(new Set(newSelected));
    };
    const unsubscribe = subscriptionInterface.subscribeSelection(callback);
    return unsubscribe;
  }, [api, subscriptionInterface, setSelected]);

  return {
    instanceId,
    getBrowserMeta,

    cursor,
    hovered,
    mode,
    status,
    statusMeta,
    dispatcher,

    getItemReference,
    tree,
    getTreeReference,
    pairs,
    getPairsReference,
    selected,
    getSelectedReference,

    controllerInterface,
    dataInterface,
    selectorInterface,
    subscriptionInterface,
  };
}
