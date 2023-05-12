import constate from 'constate';
import useContextValues from './useContextValues';

const [UIDesignToolContextProvider, ...hooks] = constate(
  useContextValues,
  (value) => value.controllerInterface,
  (value) => value.dataInterface,
  (value) => value.selectorInterface,
  (value) => value.subscriberInterface,

  (value) => value.dispatcher,
  (value) => value.instanceId,
  (value) => value.getBrowserStatus,
  (value) => value.mode,
  (value) => value.status,
  (value) => value.statusMetadata,
  (value) => value.cursor,
  (value) => value.tree,
  (value) => value.pairs,
  (value) => value.drafts,
  (value) => value.hovered,
  (value) => value.selected,
  (value) => value.getItemReference,
  (value) => value.getTreeReference,
  (value) => value.getPairsReference,
  (value) => value.getDraftsReference,
  (value) => value.getSelectedReference,
);

export const [
  // 패키지 외부 제공 (재조정 범위에 따라 내부에서도 사용)
  // - 은닉한 프로퍼티는 노출해서는 안됨
  // - 재조정 범위는 줄이되 패키지 사용자를 고려해 너무 많은 hook이 생기지 않도록 함

  /** @see DataStore */
  useUIController,
  /** @see DataStore */
  useUIData,
  /** @see DOMSelector */
  useUISelector,
  /**
   * @see DataSubscriber
   * @see DOMSubscriber
   */
  useUISubscriber,

  // 패키지 내부 사용

  useDispatcher,
  useInstanceID,
  useBrowserStatus,
  useMode,
  useStatus,
  useStatusMetadata,
  useCursor,
  useTree,
  usePairs,
  useDrafts,
  useHovered,
  useSelected,
  useItemReference,
  useTreeReference,
  usePairsReference,
  useDraftsReference,
  useSelectedReference,
] = hooks;

export default UIDesignToolContextProvider;
