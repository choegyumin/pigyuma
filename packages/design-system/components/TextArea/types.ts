import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { TextAreaProps as PrimitiveTextAreaProps } from '@/primitives/TextArea';

export type TextAreaProps = Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveTextAreaProps> & PrimitiveTextAreaProps;
export type TextAreaRef = ComponentElementRefByBox<'span'>;
