import { SelectOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

type Value = string | number;

interface SelectCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLSelectElement>, selected: Value | undefined) => void;
}

export interface SelectProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'> & SelectOnlyHTMLAttributes<HTMLInputElement>, keyof SelectCustomProps>,
    SelectCustomProps {}
export type SelectRef = ComponentElementRefByBox<'select'>;

export interface SelectItemProps extends ComponentPropsWithoutRefByBox<'option'> {}
export type SelectItemRef = ComponentElementRefByBox<'option'>;
