import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import setRef from './setRef';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import usePrevious from './usePrevious';

export interface UseValueConfig {
  notifyError?: boolean;
}

const MESSAGE_WHEN_CONTROLLED_AND_UNCONTROLLED =
  "Warning: A component contains an component with both value and defaultValue props. 'useValue' hooks must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled 'useValue' hook and remove one of these props. More info: https://reactjs.org/link/controlled-components";
const MESSAGE_WHEN_UNCONTROLLED_TO_CONTROLLED =
  "Warning: A component is changing an uncontrolled component to be controlled. 'useValue' hooks should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled 'useValue' hook for the lifetime of the component. More info: https://fb.me/react-controlled-components";
const MESSAGE_WHEN_CONTROLLED_TO_UNCONTROLLED =
  "Warning: A component is changing a controlled component to be uncontrolled. 'useValue' hooks should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled 'useValue' hook for the lifetime of the component. More info: https://fb.me/react-controlled-components";

function useValue<V>(value: V, defaultValue: V | undefined, config?: UseValueConfig): [V, Dispatch<SetStateAction<V>>];
function useValue<V>(value: V | undefined, defaultValue: V, config?: UseValueConfig): [V, Dispatch<SetStateAction<V>>];
function useValue<V>(
  value: V | undefined,
  defaultValue: V | undefined,
  config?: UseValueConfig,
): [V | undefined, Dispatch<SetStateAction<V>>];
function useValue<V>(value: V, defaultValue: V, config: UseValueConfig = {}): [V, Dispatch<SetStateAction<V>>] {
  const shouldNotifyErrorRef = useRef<boolean>(config.notifyError ?? true);

  const isControlled = value !== undefined;
  const wasControlled = usePrevious(isControlled);

  const hasDefaultValue = defaultValue !== undefined;

  const firstRun = wasControlled == undefined;

  const isControlledAndUncontrolled = isControlled && hasDefaultValue;
  const toBeControlled = !wasControlled && isControlled;
  const toBeUncontrolled = wasControlled && !isControlled;

  const [uncontrolledValue, setValue] = useState<V>(() => (isControlled ? value : defaultValue));
  const controlledValue = value;

  useIsomorphicLayoutEffect(() => {
    if (isControlled) {
      setValue(controlledValue);
    }
  }, [isControlled, controlledValue]);

  useEffect(() => {
    if (!shouldNotifyErrorRef.current) {
      return;
    }
    let message: string | undefined;
    if (firstRun) {
      if (isControlledAndUncontrolled) {
        message = MESSAGE_WHEN_CONTROLLED_AND_UNCONTROLLED;
      }
    } else {
      if (toBeControlled) {
        message = MESSAGE_WHEN_UNCONTROLLED_TO_CONTROLLED;
      } else if (toBeUncontrolled) {
        message = MESSAGE_WHEN_CONTROLLED_TO_UNCONTROLLED;
      }
    }
    if (message != null) {
      console.error(message);
      return setRef(shouldNotifyErrorRef, false);
    }
  }, [firstRun, isControlledAndUncontrolled, toBeControlled, toBeUncontrolled]);

  return [isControlled ? controlledValue : uncontrolledValue, setValue];
}

export default useValue;
