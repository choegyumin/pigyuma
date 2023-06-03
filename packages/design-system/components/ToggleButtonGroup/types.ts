import {
  CheckboxGroupElementType as PrimitiveCheckboxGroupElementType,
  CheckboxGroupItemProps as PrimitiveCheckboxGroupItemProps,
  CheckboxGroupProps as PrimitiveCheckboxGroupProps,
  CheckboxGroupRefInstance as PrimitiveCheckboxGroupRefInstance,
} from '@/primitives/CheckboxGroup';

export const ToggleButtonGroupElementType = PrimitiveCheckboxGroupElementType;
export type ToggleButtonGroupElementType = typeof ToggleButtonGroupElementType;

export interface ToggleButtonGroupCustomProps {}

export interface ToggleButtonGroupProps extends PrimitiveCheckboxGroupProps, ToggleButtonGroupCustomProps {}
export type ToggleButtonGroupRefInstance = PrimitiveCheckboxGroupRefInstance;

export const ToggleButtonGroupItemElementType = 'label';
export type ToggleButtonGroupItemElementType = typeof ToggleButtonGroupItemElementType;

export interface ToggleButtonGroupItemCustomProps {}

export interface ToggleButtonGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<'label'>, 'for' | keyof PrimitiveCheckboxGroupItemProps>,
    PrimitiveCheckboxGroupItemProps,
    ToggleButtonGroupItemCustomProps {}
export type ToggleButtonGroupItemRefInstance = React.ElementRef<ToggleButtonGroupItemElementType>;
