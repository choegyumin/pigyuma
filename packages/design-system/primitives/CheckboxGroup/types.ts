import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';
import { CheckboxProps, CheckboxRef } from '../Checkbox';

type Value = string | number;

interface CheckboxCustomProps extends Pick<CheckboxProps, 'name' | 'disabled' | 'required'> {
  value?: Array<Value>;
  defaultValue?: Array<Value>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | Array<Value>) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | Array<Value>) => void;
}

export interface CheckboxGroupProps extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof CheckboxCustomProps>, CheckboxCustomProps {}
export type CheckboxGroupRef = ComponentElementRefByBox<'span'>;

export interface CheckboxGroupItemProps extends Omit<CheckboxProps, 'onChange' | 'onChangeCapture' | 'name' | 'required' | 'checked'> {}
export type CheckboxGroupItemRef = CheckboxRef;

export type CheckboxGroupContextInitialValues = Pick<
  CheckboxGroupProps,
  'onChange' | 'onChangeCapture' | 'name' | 'disabled' | 'required'
> & {
  selected: NonNullable<CheckboxGroupProps['value']>;
};
