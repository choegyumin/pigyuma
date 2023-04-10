import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';
import { RadioProps, RadioRef } from '../Radio';

type Value = string | number;

interface RadioGroupCustomProps extends Pick<RadioProps, 'name' | 'disabled' | 'required' | 'cancelable'> {
  value?: Value | undefined;
  defaultValue?: Value | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | undefined) => void;
}

export interface RadioGroupProps extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof RadioGroupCustomProps>, RadioGroupCustomProps {}
export type RadioGroupRef = ComponentElementRefByBox<'span'>;

export interface RadioGroupItemProps
  extends Omit<RadioProps, 'onChange' | 'onChangeCapture' | 'name' | 'required' | 'checked' | 'cancelable'> {}
export type RadioGroupItemRef = RadioRef;

export interface RadioGroupContextInitialValues
  extends Pick<RadioGroupProps, 'onChange' | 'onChangeCapture' | 'name' | 'disabled' | 'required' | 'cancelable'> {
  selected: RadioGroupProps['value'];
}
