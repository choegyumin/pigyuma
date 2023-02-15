import { BrowserMeta, INITIAL_BROWSER_META, UIDesignTool, UIDesignToolStatus } from '@/api/UIDesignTool';
import { setRef } from '@pigyuma/react-utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useContextValue(initialValues: { api: UIDesignTool }) {
  const { api } = initialValues;

  const privateRef = useRef<{
    getBrowserMeta: () => BrowserMeta;
    setStatus: React.Dispatch<UIDesignToolStatus>;
  }>({
    getBrowserMeta: () => INITIAL_BROWSER_META,
    setStatus: () => undefined,
  });

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
   * UIDesignTool 메서드를 custom hook으로 접근할 수 있게 변환
   *
   * - getter 프로퍼티는 함수의 반환 값으로 감싸야 함
   * - private 프로퍼티는 노출하지 않아야 함
   * - 제공된 모든 프로퍼티는 react 상태 관리에 의존하지 않아야 하며,
   *   동일한 값이라도 react의 수명 주기를 따라야 할 경우 새로운 상태로 분리해 constate로 제공
   */
  const apiInterface = useMemo(
    () => ({
      subscribeItem: ((...args) => api.subscribeItem(...args)) as typeof api.subscribeItem,
      unsubscribeItem: ((...args) => api.unsubscribeItem(...args)) as typeof api.unsubscribeItem,
      subscribeTree: ((...args) => api.subscribeTree(...args)) as typeof api.subscribeTree,
      unsubscribeTree: ((...args) => api.unsubscribeTree(...args)) as typeof api.unsubscribeTree,
      subscribeSelection: ((...args) => api.subscribeSelection(...args)) as typeof api.subscribeSelection,
      unsubscribeSelection: ((...args) => api.unsubscribeSelection(...args)) as typeof api.unsubscribeSelection,

      getStatus: () => api.status,

      /**
       * @todo 명령형 API로 데이터를 조작했을 때, listener callback이 호출되어 컴포넌트의 상태가 업데이트 완료되기 전, 다시 명령형 API로 가져온 데이터의 무결성을 react의 수명 주기에 맞추어 보장해야 하는지 검토
       *     - custom hooks에서 반환하는 값(상태)은 deep cloning되어 참조가 끊어졌기 때문에 문제가 아닐 수도 있음. (명령형 API와 상태 기반 Hooks API의 사용법을 분리)
       *     - 보장하지 않겠다면, `useUIDesignToolAPI`에서 데이터를 읽는 메서드와 쓰는 메서드를 분리..? (데이터 조작은 반드시 명령형 API로 이뤄지는데, 동일한 hook에서 데이터를 읽는 메서드까지 제공하면 잘못된 사용으로 혼란이 발생할 수 있음)
       */
      get: ((...args) => api.get(...args)) as typeof api.get,
      getTree: () => api.tree,
      getPairs: () => api.pairs,
      getSelected: () => api.selected,

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

  useEffect(() => {
    const { unmount, getBrowserMeta, setStatus } = api.mount();
    setRef(privateRef, {
      getBrowserMeta,
      setStatus,
    });
    return () => {
      setRef(privateRef, {
        getBrowserMeta: () => INITIAL_BROWSER_META,
        setStatus: () => undefined,
      });
      unmount();
    };
  }, [api]);

  return {
    getBrowserMeta,
    status,
    cursor,
    dispatcher,
    apiInterface,
  };
}
