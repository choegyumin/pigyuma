import { NumberInputProps as PrimitiveNumberInputProps } from '@/primitives/NumberInput';

export const NumberFieldElementType = 'span';
export type NumberFieldElementType = typeof NumberFieldElementType;

export interface NumberFieldCustomProps {}

export interface NumberFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof PrimitiveNumberInputProps>,
    PrimitiveNumberInputProps,
    NumberFieldCustomProps {}
export type NumberFieldRefInstance = React.ElementRef<NumberFieldElementType>;
