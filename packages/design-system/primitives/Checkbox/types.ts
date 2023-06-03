import { CheckableInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';

type Value = string | number;

export const CheckboxElementType = 'input';
export type CheckboxElementType = typeof CheckboxElementType;

export interface CheckboxCustomProps {
  value?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | Array<Value> | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | Array<Value> | undefined) => void;
}

export interface CheckboxProps
  extends Omit<
      React.ComponentPropsWithoutRef<'span'> & CheckableInputOnlyHTMLAttributes<HTMLInputElement>,
      keyof CheckboxCustomProps | 'type'
    >,
    CheckboxCustomProps {}
export type CheckboxRefInstance = React.ElementRef<CheckboxElementType>;
