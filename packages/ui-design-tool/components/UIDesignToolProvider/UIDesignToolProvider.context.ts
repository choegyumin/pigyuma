import constate from 'constate';
import useContextValue from './useContextValue';

const constateResult = constate(
  useContextValue,
  (value) => value.controllerInterface,
  (value) => value.dataInterface,
  (value) => value.elementInterface,
  (value) => value.subscriptionInterface,

  (value) => value.dispatcher,
  (value) => value.instanceId,
  (value) => value.getBrowserMeta,
  (value) => value.status,
  (value) => value.cursor,
  (value) => value.getItemReference,
  (value) => value.tree,
  (value) => value.getTreeReference,
  (value) => value.pairs,
  (value) => value.getPairsReference,
  (value) => value.selection,
  (value) => value.getSelectionReference,
);

export const [
  ,
  // 패키지 외부 제공 (재조정 범위에 따라 내부에서도 사용)
  // - 은닉한 프로퍼티는 노출해서는 안됨
  // - 재조정 범위는 줄이되 패키지 사용자를 고려해 너무 많은 hook이 생기지 않도록 함
  useUIController,
  useUIData,
  useUIElement,
  useUISubscription,

  // 패키지 내부 사용
  useDispatcher,
  useInstanceID,
  useBrowserMeta,
  useStatus,
  useCursor,
  useItemReference,
  useTree,
  useTreeReference,
  usePairs,
  usePairsReference,
  useSelection,
  useSelectionReference,
] = constateResult;

const [UIDesignToolContextProvider] = constateResult;
export default UIDesignToolContextProvider;
