import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { NumberInputProps as PrimitiveNumberInputProps } from '@/primitives/NumberInput';

export type NumberFieldProps = Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveNumberInputProps> &
  Omit<PrimitiveNumberInputProps, 'type'>;
export type NumberFieldRef = ComponentElementRefByBox<'span'>;
