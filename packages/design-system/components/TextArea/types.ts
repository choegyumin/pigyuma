import { TextAreaProps as PrimitiveTextAreaProps } from '@/primitives/TextArea';
import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';

export interface TextAreaProps extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveTextAreaProps>, PrimitiveTextAreaProps {}
export type TextAreaRef = ComponentElementRefByBox<'span'>;
