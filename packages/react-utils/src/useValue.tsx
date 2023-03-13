import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import setRef from './setRef';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import usePrevious from './usePrevious';

type UseValueConfig = {
  notifyError?: boolean;
};

const MESSAGE_WHEN_UNCONTROLLED_TO_CONTROLLED =
  'Warning: A component is changing an uncontrolled input of type text to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components';
const MESSAGE_WHEN_CONTROLLED_TO_UNCONTROLLED =
  'Warning: A component is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components';

function useValue<V>(value: V, defaultValue: V | undefined, config?: UseValueConfig): [V, Dispatch<SetStateAction<V>>];
function useValue<V>(value: V | undefined, defaultValue: V, config?: UseValueConfig): [V, Dispatch<SetStateAction<V>>];
function useValue<V>(
  value: V | undefined,
  defaultValue: V | undefined,
  config?: UseValueConfig,
): [V | undefined, Dispatch<SetStateAction<V>>];
function useValue<V>(value: V, defaultValue: V, config: UseValueConfig = {}): [V, Dispatch<SetStateAction<V>>] {
  const wasNotifyErrorRef = useRef<boolean>(!(config.notifyError ?? true));

  const isControlled = value !== undefined;
  const wasControlled = usePrevious(isControlled);

  const firstRun = wasControlled == undefined;

  const toBeControlled = !wasControlled && isControlled;
  const toBeUncontrolled = wasControlled && !isControlled;

  const [uncontrolled, setValue] = useState<V>(() => (isControlled ? value : defaultValue));
  const controlled = value;

  useIsomorphicLayoutEffect(() => {
    if (isControlled) {
      setValue(controlled);
    }
  }, [isControlled, controlled]);

  useEffect(() => {
    if (firstRun || wasNotifyErrorRef.current) {
      return;
    }
    if (toBeControlled) {
      console.error(MESSAGE_WHEN_UNCONTROLLED_TO_CONTROLLED);
      return setRef(wasNotifyErrorRef, true);
    }
    if (toBeUncontrolled) {
      console.error(MESSAGE_WHEN_CONTROLLED_TO_UNCONTROLLED);
      return setRef(wasNotifyErrorRef, true);
    }
  }, [firstRun, toBeControlled, toBeUncontrolled]);

  return [isControlled ? controlled : uncontrolled, setValue];
}

export default useValue;
