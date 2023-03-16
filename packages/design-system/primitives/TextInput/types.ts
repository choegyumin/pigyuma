import { TextInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string;

type TextInputCustomProps = {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLTextAreaElement>, value: Value) => void;
  autoSelect?: boolean;
};

export type TextInputProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & TextInputOnlyHTMLAttributes<HTMLInputElement>,
  keyof TextInputCustomProps
> &
  TextInputCustomProps;
export type TextInputRef = ComponentElementRefByBox<'input'>;
