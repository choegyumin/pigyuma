import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { TextAreaProps as PrimitiveTextAreaProps } from '@/primitives/TextArea';

export interface TextAreaProps extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveTextAreaProps>, PrimitiveTextAreaProps {}
export type TextAreaRef = ComponentElementRefByBox<'span'>;
