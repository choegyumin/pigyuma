import constate from 'constate';
import useContextValues from './useContextValues';

const [CheckboxGroupContextProvider, ...hooks] = constate(
  useContextValues,
  ({ selected }) => selected,
  ({ name, disabled, required }) => ({ name, disabled, required }),
  ({ onChange, onChangeCapture }) => ({ onChange, onChangeCapture }),
);

export const [useSelectedValue, useCheckboxConfig, useCheckboxEvents] = hooks;

export default CheckboxGroupContextProvider;
