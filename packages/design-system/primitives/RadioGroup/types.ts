import { RadioElementType, RadioProps, RadioRefInstance } from '../Radio';

type Value = string | number;

export const RadioGroupElementType = 'span';
export type RadioGroupElementType = typeof RadioGroupElementType;

export interface RadioGroupCustomProps extends Pick<RadioProps, 'name' | 'disabled' | 'required' | 'cancelable'> {
  value?: Value | undefined;
  defaultValue?: Value | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | undefined) => void;
}

export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof RadioGroupCustomProps>, RadioGroupCustomProps {}
export type RadioGroupRefInstance = React.ElementRef<RadioGroupElementType>;

export const RadioGroupItemElementType = RadioElementType;
export type RadioGroupItemElementType = typeof RadioElementType;

export interface RadioGroupItemCustomProps {}

export interface RadioGroupItemProps
  extends Omit<RadioProps, 'onChange' | 'onChangeCapture' | 'name' | 'required' | 'checked' | 'cancelable'>,
    RadioGroupItemCustomProps {}
export type RadioGroupItemRefInstance = RadioRefInstance;

export interface RadioGroupContextInitialValues
  extends Pick<RadioGroupProps, 'onChange' | 'onChangeCapture' | 'name' | 'disabled' | 'required' | 'cancelable'> {
  selected: RadioGroupProps['value'];
}
