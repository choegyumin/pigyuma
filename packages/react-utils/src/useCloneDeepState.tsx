import { cloneDeep } from '@pigyuma/utils';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type StateFunction<S> = (prevState?: S) => S;

function createSetStateAction<S>(nextState: S | StateFunction<S>): S | StateFunction<S> {
  if (typeof nextState === 'function') {
    return (prevState?: S) => cloneDeep((nextState as StateFunction<S>)(prevState));
  }
  return cloneDeep(nextState);
}

function useCloneDeepState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useCloneDeepState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
function useCloneDeepState<S>(initialState?: S | (() => S)) {
  const [state, setStateObject] = useState<S | undefined>(createSetStateAction<S | undefined>(initialState));
  const setState = useCallback<typeof setStateObject>(
    (value) => setStateObject(createSetStateAction<S | undefined>(value)),
    [setStateObject],
  );
  return [state, setState] as const;
}

export default useCloneDeepState;
