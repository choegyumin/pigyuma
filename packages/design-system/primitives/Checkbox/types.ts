import { CheckableInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string | number;

type CheckboxCustomProps = {
  value?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | Array<Value> | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | Array<Value> | undefined) => void;
};

export type CheckboxProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & CheckableInputOnlyHTMLAttributes<HTMLInputElement>,
  keyof CheckboxCustomProps | 'type'
> &
  CheckboxCustomProps;
export type CheckboxRef = ComponentElementRefByBox<'input'>;
