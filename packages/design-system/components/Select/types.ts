import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@/primitives/Box';
import {
  SelectItemProps as PrimitiveSelectItemProps,
  SelectItemRef as PrimitiveSelectItemRef,
  SelectProps as PrimitiveSelectProps,
} from '@/primitives/Select';

export type SelectProps = Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveSelectProps> & PrimitiveSelectProps;
export type SelectRef = ComponentElementRefByBox<'span'>;

export type SelectItemProps = PrimitiveSelectItemProps;
export type SelectItemRef = PrimitiveSelectItemRef;
