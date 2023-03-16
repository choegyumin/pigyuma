import constate from 'constate';
import useContextValues from './useContextValues';

const [RadioGroupContextProvider, ...hooks] = constate(
  useContextValues,
  ({ selected }) => selected,
  ({ name, cancelable, disabled, required }) => ({ name, cancelable, disabled, required }),
  ({ onChange, onChangeCapture }) => ({ onChange, onChangeCapture }),
);

export const [useSelectedValue, useRadioConfig, useRadioEvents] = hooks;

export default RadioGroupContextProvider;
