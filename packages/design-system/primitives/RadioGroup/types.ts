import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';
import { RadioProps, RadioRef } from '../Radio';

type Value = string | number;

type RadioGroupCustomProps = Pick<RadioProps, 'name' | 'disabled' | 'required' | 'cancelable'> & {
  value?: Value | undefined;
  defaultValue?: Value | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | undefined) => void;
};

export type RadioGroupProps = Omit<ComponentPropsWithoutRefByBox<'span'>, keyof RadioGroupCustomProps> & RadioGroupCustomProps;
export type RadioGroupRef = ComponentElementRefByBox<'span'>;

export type RadioGroupItemProps = Omit<RadioProps, 'onChange' | 'onChangeCapture' | 'name' | 'required' | 'checked' | 'cancelable'>;
export type RadioGroupItemRef = RadioRef;

export type RadioGroupContextInitialValues = Pick<
  RadioGroupProps,
  'onChange' | 'onChangeCapture' | 'name' | 'disabled' | 'required' | 'cancelable'
> & {
  selected: RadioGroupProps['value'];
};
