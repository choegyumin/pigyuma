import { TextareaOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string;

type TextAreaCustomProps = {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLTextAreaElement>, value: Value) => void;
  autoSelect?: boolean;
};

export type TextAreaProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & TextareaOnlyHTMLAttributes<HTMLTextAreaElement>,
  keyof TextAreaCustomProps
> &
  TextAreaCustomProps;
export type TextAreaRef = ComponentElementRefByBox<'textarea'>;