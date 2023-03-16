import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@/primitives/Box';
import { PCheckboxGroupItemProps, PCheckboxGroupProps, PCheckboxGroupRef } from '@/primitives/CheckboxGroup';

export type ToggleButtonGroupProps = PCheckboxGroupProps;
export type ToggleButtonGroupRef = PCheckboxGroupRef;

export type ToggleButtonGroupItemProps = Omit<ComponentPropsWithoutRefByBox<'label'>, 'for' | keyof PCheckboxGroupItemProps> &
  PCheckboxGroupItemProps;
export type ToggleButtonGroupItemRef = ComponentElementRefByBox<'label'>;
