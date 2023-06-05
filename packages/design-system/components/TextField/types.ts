import { TextInputProps as PrimitiveTextInputProps } from '@/primitives/TextInput';

export const TextFieldElementType = 'span';
export type TextFieldElementType = typeof TextFieldElementType;

export interface TextFieldCustomProps {}

export interface TextFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof PrimitiveTextInputProps>,
    PrimitiveTextInputProps,
    TextFieldCustomProps {}
export type TextFieldRefInstance = React.ElementRef<TextFieldElementType>;
