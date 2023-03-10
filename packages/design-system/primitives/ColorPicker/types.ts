import { ColorInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string;

type ColorPickerCustomProps = {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
};

export type ColorPickerProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & ColorInputOnlyHTMLAttributes<HTMLInputElement>,
  keyof ColorPickerCustomProps | 'type'
> &
  ColorPickerCustomProps;
export type ColorPickerRef = ComponentElementRefByBox<'input'>;
