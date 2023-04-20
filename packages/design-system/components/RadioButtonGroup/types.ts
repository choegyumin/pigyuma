import {
  RadioGroupItemProps as PRadioGroupItemProps,
  RadioGroupProps as PRadioGroupProps,
  RadioGroupRef as PRadioGroupRef,
} from '@/primitives/RadioGroup';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

export interface RadioButtonGroupProps extends PRadioGroupProps {}
export type RadioButtonGroupRef = PRadioGroupRef;

export interface RadioButtonGroupItemProps
  extends Omit<ComponentPropsWithoutRefByBox<'label'>, 'for' | keyof PRadioGroupItemProps>,
    PRadioGroupItemProps {}
export type RadioButtonGroupItemRef = ComponentElementRefByBox<'label'>;
