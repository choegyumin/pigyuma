import {
  SelectItemElementType as PrimitiveSelectItemElementType,
  SelectItemProps as PrimitiveSelectItemProps,
  SelectItemRefInstance as PrimitiveSelectItemRefInstance,
  SelectProps as PrimitiveSelectProps,
} from '@/primitives/Select';

export const SelectElementType = 'span';
export type SelectElementType = typeof SelectElementType;

export interface SelectCustomProps {}

export interface SelectProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof PrimitiveSelectProps>,
    PrimitiveSelectProps,
    SelectCustomProps {}
export type SelectRefInstance = React.ElementRef<SelectElementType>;

export const SelectItemElementType = PrimitiveSelectItemElementType;
export type SelectItemElementType = typeof SelectItemElementType;

export interface SelectItemCustomProps {}

export interface SelectItemProps extends PrimitiveSelectItemProps, SelectItemCustomProps {}
export type SelectItemRefInstance = PrimitiveSelectItemRefInstance;
