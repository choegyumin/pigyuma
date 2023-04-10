import { ColorInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

type Value = string;

interface ColorPickerCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
}

export interface ColorPickerProps
  extends Omit<
      ComponentPropsWithoutRefByBox<'span'> & ColorInputOnlyHTMLAttributes<HTMLInputElement>,
      keyof ColorPickerCustomProps | 'type'
    >,
    ColorPickerCustomProps {}
export type ColorPickerRef = ComponentElementRefByBox<'input'>;
