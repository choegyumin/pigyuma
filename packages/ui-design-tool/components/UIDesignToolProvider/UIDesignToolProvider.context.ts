import constate from 'constate';
import useContextValue from './useContextValue';

const constateResult = constate(
  useContextValue,
  (value) => value.apiInterface,
  (value) => value.status,
  (value) => value.dispatcher,
  (value) => value.getBrowserMeta,
  (value) => value.cursor,
);

export const [
  ,
  // 패키지 외부 제공 (재조정 범위에 따라 내부에서도 사용)
  // - 은닉한 프로퍼티는 노출해서는 안됨
  // - 재조정 범위는 줄이되 패키지 사용자를 고려해 너무 많은 hook이 생기지 않도록 함
  useUIDesignToolAPI,
  useUIDesignToolStatus,

  // 패키지 내부 사용
  useDispatcher,
  useBrowserMeta,
  useCursor,
] = constateResult;

const [UIDesignToolContextProvider] = constateResult;
export default UIDesignToolContextProvider;
