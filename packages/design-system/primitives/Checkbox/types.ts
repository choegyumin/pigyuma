import { CheckableInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

type Value = string | number;

interface CheckboxCustomProps {
  value?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | Array<Value> | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | Array<Value> | undefined) => void;
}

export interface CheckboxProps
  extends Omit<
      ComponentPropsWithoutRefByBox<'span'> & CheckableInputOnlyHTMLAttributes<HTMLInputElement>,
      keyof CheckboxCustomProps | 'type'
    >,
    CheckboxCustomProps {}
export type CheckboxRef = ComponentElementRefByBox<'input'>;
