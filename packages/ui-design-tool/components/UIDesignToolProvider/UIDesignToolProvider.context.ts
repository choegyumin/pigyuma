import constate from 'constate';
import useContextValues from './useContextValues';

const [UIDesignToolContextProvider, ...hooks] = constate(
  useContextValues,
  (value) => value.controllerInterface,
  (value) => value.dataInterface,
  (value) => value.selectorInterface,
  (value) => value.subscriptionInterface,

  (value) => value.dispatcher,
  (value) => value.instanceId,
  (value) => value.getBrowserMeta,
  (value) => value.mode,
  (value) => value.status,
  (value) => value.statusMeta,
  (value) => value.cursor,
  (value) => value.hovered,
  (value) => value.tree,
  (value) => value.pairs,
  (value) => value.selected,
  (value) => value.getItemReference,
  (value) => value.getTreeReference,
  (value) => value.getPairsReference,
  (value) => value.getSelectedReference,
  (value) => value.getDraftsReference,
);

export const [
  // 패키지 외부 제공 (재조정 범위에 따라 내부에서도 사용)
  // - 은닉한 프로퍼티는 노출해서는 안됨
  // - 재조정 범위는 줄이되 패키지 사용자를 고려해 너무 많은 hook이 생기지 않도록 함
  useUIController,
  useUIData,
  useUISelector,
  useUISubscription,

  // 패키지 내부 사용
  useDispatcher,
  useInstanceID,
  useBrowserMeta,
  useMode,
  useStatus,
  useStatusMeta,
  useCursor,
  useHovered,
  useTree,
  usePairs,
  useSelected,
  useItemReference,
  useTreeReference,
  usePairsReference,
  useSelectedReference,
  useDraftsReference,
] = hooks;

export default UIDesignToolContextProvider;
