import { TextInputProps as PrimitiveTextInputProps } from '@/primitives/TextInput';
import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveTextInputProps>,
    PrimitiveTextInputProps {}
export type TextFieldRef = ComponentElementRefByBox<'span'>;
