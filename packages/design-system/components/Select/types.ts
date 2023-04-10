import {
  SelectItemProps as PrimitiveSelectItemProps,
  SelectItemRef as PrimitiveSelectItemRef,
  SelectProps as PrimitiveSelectProps,
} from '@/primitives/Select';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

export interface SelectProps extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveSelectProps>, PrimitiveSelectProps {}
export type SelectRef = ComponentElementRefByBox<'span'>;

export interface SelectItemProps extends PrimitiveSelectItemProps {}
export type SelectItemRef = PrimitiveSelectItemRef;
