import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { TextInputProps as PrimitiveTextInputProps } from '@/primitives/TextInput';

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveTextInputProps>,
    PrimitiveTextInputProps {}
export type TextFieldRef = ComponentElementRefByBox<'span'>;
