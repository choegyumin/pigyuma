import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { TextInputProps as PrimitiveTextInputProps } from '@/primitives/TextInput';

export type TextFieldProps = Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveTextInputProps> & PrimitiveTextInputProps;
export type TextFieldRef = ComponentElementRefByBox<'span'>;
