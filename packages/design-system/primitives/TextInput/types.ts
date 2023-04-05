import { TextInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string;

interface TextInputCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
  autoSelect?: boolean;
}

export interface TextInputProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'> & TextInputOnlyHTMLAttributes<HTMLInputElement>, keyof TextInputCustomProps>,
    TextInputCustomProps {}
export type TextInputRef = ComponentElementRefByBox<'input'>;
