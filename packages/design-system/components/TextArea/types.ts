import { TextAreaProps as PrimitiveTextAreaProps } from '@/primitives/TextArea';

export const TextAreaElementType = 'span';
export type TextAreaElementType = typeof TextAreaElementType;

export interface TextAreaCustomProps {}

export interface TextAreaProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof PrimitiveTextAreaProps>,
    PrimitiveTextAreaProps,
    TextAreaCustomProps {}
export type TextAreaRefInstance = React.ElementRef<TextAreaElementType>;
