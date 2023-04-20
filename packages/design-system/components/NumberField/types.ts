import { NumberInputProps as PrimitiveNumberInputProps } from '@/primitives/NumberInput';
import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';

export interface NumberFieldProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveNumberInputProps>,
    Omit<PrimitiveNumberInputProps, 'type'> {}
export type NumberFieldRef = ComponentElementRefByBox<'span'>;
