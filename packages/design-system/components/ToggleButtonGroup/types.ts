import {
  CheckboxGroupItemProps as PCheckboxGroupItemProps,
  CheckboxGroupProps as PCheckboxGroupProps,
  CheckboxGroupRef as PCheckboxGroupRef,
} from '@/primitives/CheckboxGroup';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

export interface ToggleButtonGroupProps extends PCheckboxGroupProps {}
export type ToggleButtonGroupRef = PCheckboxGroupRef;

export interface ToggleButtonGroupItemProps
  extends Omit<ComponentPropsWithoutRefByBox<'label'>, 'for' | keyof PCheckboxGroupItemProps>,
    PCheckboxGroupItemProps {}
export type ToggleButtonGroupItemRef = ComponentElementRefByBox<'label'>;
