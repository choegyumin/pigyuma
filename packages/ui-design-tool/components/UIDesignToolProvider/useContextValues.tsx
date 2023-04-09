import { Canvas } from '@/api/Canvas/model';
import { INITIAL_BROWSER_STATUS } from '@/api/ElementSelector';
import { UIDesignTool } from '@/api/UIDesignTool';
import { BrowserStatus } from '@/types/Browser';
import { UIRecordKey } from '@/types/Identifier';
import { UIDesignToolMode, UIDesignToolStatus, UIDesignToolStatusMetadata } from '@/types/Status';
import { setRef, useCloneDeepState, useStableCallback } from '@pigyuma/react-utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useContextValues(initialValues: { api: UIDesignTool }) {
  const { api } = initialValues;

  const privateRef = useRef<{
    getBrowserStatus: () => BrowserStatus;
    setStatus: React.Dispatch<UIDesignToolStatus>;
  }>({
    getBrowserStatus: () => INITIAL_BROWSER_STATUS,
    setStatus: () => undefined,
  });

  const instanceId = api.id;
  const getBrowserStatus = useCallback(
    (...args: Parameters<typeof privateRef.current.getBrowserStatus>) => privateRef.current.getBrowserStatus(...args),
    [],
  );
  const setStatus = useCallback((...args: Parameters<typeof privateRef.current.setStatus>) => privateRef.current.setStatus(...args), []);

  const [cursor, setCursor] = useState<NonNullable<React.CSSProperties['cursor']>>('default');
  const [hovered, setHovered] = useState<UIRecordKey>();

  const dispatcher = useMemo(
    () => ({
      setCursor,
      setHovered,
      setStatus,
    }),
    [setCursor, setHovered, setStatus],
  );

  const [mode, applyMode] = useState<UIDesignToolMode>(() => api.mode);
  const [status, applyStatus] = useState<UIDesignToolStatus>(() => api.status);
  const [statusMetadata, applyStatusMetadata] = useState<UIDesignToolStatusMetadata>(() => ({
    interactionType: api.interactionType,
    transformMethod: api.transformMethod,
  }));

  /**
   * 상태의 Life cycle을 React에 의존하기 위해 참조 제거
   * @todo 성능 저하가 발생하면: 최초 한번 cloneDeep 후, 변경된 아이템만 clone하도록 개선
   */
  const [pairs, applyPairs] = useCloneDeepState<typeof api.pairs>(() => api.pairs);
  const tree = useMemo<typeof api.tree>(() => pairs.get(Canvas.key) as Canvas, [pairs]);
  const [drafts, applyDrafts] = useCloneDeepState<typeof api.drafts>(() => api.drafts);
  const [selected, applySelected] = useCloneDeepState<typeof api.selected>(() => api.selected);

  /** @see ModelStore */
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
      toggleDraft: ((...args) => api.toggleDraft(...args)) as typeof api.toggleDraft,
      flushDrafts: ((...args) => api.flushDrafts(...args)) as typeof api.flushDrafts,
    }),
    [api],
  );

  /** @see ModelStore */
  const dataInterface = useMemo(
    () => ({
      mode,
      status,
      get: ((targetKey) => pairs.get(targetKey)) as typeof api.get,
      has: ((targetKey) => pairs.has(targetKey)) as typeof api.has,
      tree,
      pairs,
      drafts,
      isDraft: ((targetKey) => drafts.has(targetKey)) as typeof api.isDraft,
      selected,
      isSelected: ((targetKey) => selected.has(targetKey)) as typeof api.isSelected,
    }),
    [api, mode, status, tree, pairs, drafts, selected],
  );

  /** @see ElementSelector */
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
  /** @see DataSubscriber */
  const subscriberInterface = useMemo(
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
  const getDraftsReference = useStableCallback(() => dataInterface.drafts);
  const getSelectedReference = useStableCallback(() => dataInterface.selected);

  useEffect(() => {
    const { getBrowserStatus, setStatus } = api.mount();
    setRef(privateRef, {
      getBrowserStatus,
      setStatus,
    });
    return () => {
      setRef(privateRef, {
        getBrowserStatus: () => INITIAL_BROWSER_STATUS,
        setStatus: () => undefined,
      });
      api.unmount();
    };
  }, [api]);

  useEffect(() => {
    const callback = (mode: UIDesignToolMode) => {
      applyMode(mode);
    };
    const unsubscribe = subscriberInterface.subscribeMode(callback);
    return unsubscribe;
  }, [api, subscriberInterface, applyMode]);

  useEffect(() => {
    const callback = (status: UIDesignToolStatus, meta: UIDesignToolStatusMetadata) => {
      applyStatus(status);
      applyStatusMetadata(meta);
    };
    const unsubscribe = subscriberInterface.subscribeStatus(callback);
    return unsubscribe;
  }, [api, subscriberInterface, applyStatus, applyStatusMetadata]);

  useEffect(() => {
    const callback = () => {
      applyPairs(api.pairs);
      applyDrafts(api.drafts);
    };
    const unsubscribe = subscriberInterface.subscribeTree(callback);
    return unsubscribe;
  }, [api, subscriberInterface, applyPairs, applyDrafts]);

  useEffect(() => {
    const callback = (newSelected: UIRecordKey[]) => {
      applySelected(new Set(newSelected));
    };
    const unsubscribe = subscriberInterface.subscribeSelection(callback);
    return unsubscribe;
  }, [api, subscriberInterface, applySelected]);

  return {
    instanceId,
    getBrowserStatus,

    cursor,
    hovered,
    mode,
    status,
    statusMetadata,
    dispatcher,

    tree,
    pairs,
    drafts,
    selected,
    getItemReference,
    getTreeReference,
    getPairsReference,
    getDraftsReference,
    getSelectedReference,

    controllerInterface,
    dataInterface,
    selectorInterface,
    subscriberInterface,
  };
}
