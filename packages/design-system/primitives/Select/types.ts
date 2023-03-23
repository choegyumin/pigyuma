import { SelectOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string | number;

type SelectCustomProps = {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLSelectElement>, selected: Value | undefined) => void;
};

export type SelectProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & SelectOnlyHTMLAttributes<HTMLInputElement>,
  keyof SelectCustomProps
> &
  SelectCustomProps;
export type SelectRef = ComponentElementRefByBox<'select'>;

export type SelectItemProps = ComponentPropsWithoutRefByBox<'option'>;
export type SelectItemRef = ComponentElementRefByBox<'option'>;
