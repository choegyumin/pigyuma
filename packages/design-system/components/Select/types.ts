import {
  SelectItemProps as PrimitiveSelectItemProps,
  SelectItemRef as PrimitiveSelectItemRef,
  SelectProps as PrimitiveSelectProps,
  SelectRef as PrimitiveSelectRef,
} from '@/primitives/Select';

export type SelectProps = Omit<PrimitiveSelectProps, 'slots'>;
export type SelectRef = PrimitiveSelectRef;

export type SelectItemProps = PrimitiveSelectItemProps;
export type SelectItemRef = PrimitiveSelectItemRef;
