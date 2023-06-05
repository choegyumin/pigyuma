import { CheckboxElementType, CheckboxProps, CheckboxRefInstance } from '../Checkbox';

type Value = string | number;

export const CheckboxGroupElementType = 'span';
export type CheckboxGroupElementType = typeof CheckboxGroupElementType;

export interface CheckboxGroupCustomProps extends Pick<CheckboxProps, 'name' | 'disabled' | 'required'> {
  value?: Array<Value>;
  defaultValue?: Array<Value>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | Array<Value>) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | Array<Value>) => void;
}

export interface CheckboxGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof CheckboxGroupCustomProps>,
    CheckboxGroupCustomProps {}
export type CheckboxGroupRefInstance = React.ElementRef<CheckboxGroupElementType>;

export const CheckboxGroupItemElementType = CheckboxElementType;
export type CheckboxGroupItemElementType = typeof CheckboxElementType;

export interface CheckboxGroupItemCustomProps {}

export interface CheckboxGroupItemProps
  extends Omit<CheckboxProps, 'onChange' | 'onChangeCapture' | 'name' | 'required' | 'checked'>,
    CheckboxGroupItemCustomProps {}
export type CheckboxGroupItemRefInstance = CheckboxRefInstance;

export type CheckboxGroupContextInitialValues = Pick<
  CheckboxGroupProps,
  'onChange' | 'onChangeCapture' | 'name' | 'disabled' | 'required'
> & {
  selected: NonNullable<CheckboxGroupProps['value']>;
};
